package com.example.dictionary.service;

import com.example.dictionary.dto.GroupDtos.CreateGroupRequest;
import com.example.dictionary.dto.GroupDtos.GroupDetailResponse;
import com.example.dictionary.dto.GroupDtos.GroupSummaryResponse;
import com.example.dictionary.dto.GroupDtos.MemberResponse;
import com.example.dictionary.model.AppUser;
import com.example.dictionary.model.GroupMember;
import com.example.dictionary.model.StudyGroup;
import com.example.dictionary.repository.GroupMemberRepository;
import com.example.dictionary.repository.StudyGroupRepository;
import com.example.dictionary.repository.UserRepository;
import com.example.dictionary.repository.XpEventRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** Study groups: friends join with an invite code and see each other's XP ranked. */
@Service
public class GroupService {

    static final int MAX_MEMBERS = 30;
    static final int MAX_GROUPS_PER_USER = 10;
    private static final String DEFAULT_EMOJI = "🏆";
    // No 0/O or 1/I so a code read out loud or from a screenshot is hard to get wrong.
    private static final String CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int CODE_LENGTH = 6;

    private final StudyGroupRepository groupRepository;
    private final GroupMemberRepository memberRepository;
    private final UserRepository userRepository;
    private final XpEventRepository xpRepository;
    private final ZoneId zone = ZoneId.systemDefault();
    private final SecureRandom random = new SecureRandom();

    public GroupService(StudyGroupRepository groupRepository, GroupMemberRepository memberRepository,
                        UserRepository userRepository, XpEventRepository xpRepository) {
        this.groupRepository = groupRepository;
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
        this.xpRepository = xpRepository;
    }

    @Transactional
    public GroupSummaryResponse create(String username, CreateGroupRequest request) {
        AppUser user = user(username);
        requireRoomForAnotherGroup(username);
        String emoji = request.emoji() == null || request.emoji().isBlank() ? DEFAULT_EMOJI : request.emoji().trim();
        StudyGroup group = groupRepository.save(new StudyGroup(request.name().trim(), emoji, newCode(), user));
        memberRepository.save(new GroupMember(group, user));
        return summary(group, 1, user);
    }

    @Transactional
    public GroupSummaryResponse join(String username, String rawCode) {
        AppUser user = user(username);
        StudyGroup group = groupRepository.findByInviteCode(rawCode.trim().toUpperCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bunday kodli guruh topilmadi"));
        if (memberRepository.existsByGroupIdAndUserUsername(group.getId(), username)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Siz bu guruhning a'zosisiz");
        }
        long members = memberRepository.countByGroupId(group.getId());
        if (members >= MAX_MEMBERS) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Guruh to'lgan (" + MAX_MEMBERS + " kishi)");
        }
        requireRoomForAnotherGroup(username);
        memberRepository.save(new GroupMember(group, user));
        return summary(group, (int) members + 1, user);
    }

    @Transactional(readOnly = true)
    public List<GroupSummaryResponse> list(String username) {
        return memberRepository.findByUserUsernameOrderByJoinedAtAsc(username).stream()
                .map(m -> summary(m.getGroup(), (int) memberRepository.countByGroupId(m.getGroup().getId()), m.getUser()))
                .toList();
    }

    @Transactional(readOnly = true)
    public GroupDetailResponse detail(String username, Long groupId) {
        GroupMember mine = membership(username, groupId);
        StudyGroup group = mine.getGroup();
        List<GroupMember> members = memberRepository.findByGroupIdOrderByJoinedAtAsc(groupId);
        List<Long> ids = members.stream().map(m -> m.getUser().getId()).toList();

        LocalDate weekStart = LocalDate.now(zone).with(DayOfWeek.MONDAY);
        Map<Long, Long> week = sums(xpRepository.xpByOwnerSince(ids, weekStart.atStartOfDay(zone).toInstant()));
        Map<Long, Long> total = sums(xpRepository.xpByOwnerSince(ids, Instant.EPOCH));

        List<MemberResponse> rows = members.stream().map(m -> {
            AppUser u = m.getUser();
            long totalXp = total.getOrDefault(u.getId(), 0L);
            int level = Levels.levelFor(totalXp);
            return new MemberResponse(u.getId(), u.getFirstName() + " " + u.getLastName(), u.getUsername(), level,
                    Levels.titleFor(level), week.getOrDefault(u.getId(), 0L), totalXp,
                    u.getUsername().equals(username), u.getId().equals(group.getOwner().getId()));
        }).sorted(Comparator.comparingLong(MemberResponse::weekXp).reversed()
                .thenComparing(Comparator.comparingLong(MemberResponse::totalXp).reversed())
                .thenComparing(MemberResponse::name)).toList();

        return new GroupDetailResponse(group.getId(), group.getName(), group.getEmoji(), group.getInviteCode(),
                group.getOwner().getUsername().equals(username), weekStart, rows);
    }

    /** Leaves the group; the owner role passes to the longest-standing member, and the last one out closes it. */
    @Transactional
    public void leave(String username, Long groupId) {
        GroupMember mine = membership(username, groupId);
        StudyGroup group = mine.getGroup();
        List<GroupMember> others = memberRepository.findByGroupIdOrderByJoinedAtAsc(groupId).stream()
                .filter(m -> !m.getUser().getUsername().equals(username))
                .toList();
        memberRepository.delete(mine);
        if (others.isEmpty()) {
            groupRepository.delete(group);
        } else if (group.getOwner().getUsername().equals(username)) {
            group.setOwner(others.get(0).getUser());
        }
    }

    @Transactional
    public void removeMember(String username, Long groupId, Long userId) {
        StudyGroup group = membership(username, groupId).getGroup();
        requireOwner(group, username);
        if (group.getOwner().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Guruh egasini chiqarib bo'lmaydi");
        }
        GroupMember target = memberRepository.findByGroupIdAndUserId(groupId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "A'zo topilmadi"));
        memberRepository.delete(target);
    }

    @Transactional
    public void delete(String username, Long groupId) {
        StudyGroup group = membership(username, groupId).getGroup();
        requireOwner(group, username);
        memberRepository.deleteAll(memberRepository.findByGroupIdOrderByJoinedAtAsc(groupId));
        groupRepository.delete(group);
    }

    private AppUser user(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    /** Non-members get the same 404 as a group that does not exist, so ids cannot be probed. */
    private GroupMember membership(String username, Long groupId) {
        return memberRepository.findByGroupIdAndUserUsername(groupId, username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Guruh topilmadi"));
    }

    private void requireOwner(StudyGroup group, String username) {
        if (!group.getOwner().getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bu amalni faqat guruh egasi bajaradi");
        }
    }

    private void requireRoomForAnotherGroup(String username) {
        if (memberRepository.countByUserUsername(username) >= MAX_GROUPS_PER_USER) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Eng ko'pi bilan " + MAX_GROUPS_PER_USER + " ta guruhda bo'lish mumkin");
        }
    }

    private GroupSummaryResponse summary(StudyGroup group, int memberCount, AppUser viewer) {
        return new GroupSummaryResponse(group.getId(), group.getName(), group.getEmoji(), memberCount,
                group.getOwner().getId().equals(viewer.getId()));
    }

    private static Map<Long, Long> sums(List<Object[]> rows) {
        Map<Long, Long> result = new HashMap<>();
        for (Object[] row : rows) {
            result.put(((Number) row[0]).longValue(), ((Number) row[1]).longValue());
        }
        return result;
    }

    private String newCode() {
        while (true) {
            StringBuilder code = new StringBuilder(CODE_LENGTH);
            for (int i = 0; i < CODE_LENGTH; i++) {
                code.append(CODE_ALPHABET.charAt(random.nextInt(CODE_ALPHABET.length())));
            }
            if (!groupRepository.existsByInviteCode(code.toString())) {
                return code.toString();
            }
        }
    }
}
