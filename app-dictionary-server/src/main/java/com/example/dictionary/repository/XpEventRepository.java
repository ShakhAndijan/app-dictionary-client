package com.example.dictionary.repository;

import com.example.dictionary.model.XpEvent;
import com.example.dictionary.model.XpSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Collection;
import java.util.List;

public interface XpEventRepository extends JpaRepository<XpEvent, Long> {

    @Query("select coalesce(sum(e.amount), 0) from XpEvent e where e.owner.username = :username")
    long totalXp(@Param("username") String username);

    @Query("select coalesce(sum(e.amount), 0) from XpEvent e where e.owner.username = :username and e.createdAt >= :from")
    long xpSince(@Param("username") String username, @Param("from") Instant from);

    /** XP events in {@code [from, to)} as {createdAt, amount}. */
    @Query("select e.createdAt, e.amount from XpEvent e "
            + "where e.owner.username = :username and e.createdAt >= :from and e.createdAt < :to")
    List<Object[]> xpEventsBetween(@Param("username") String username, @Param("from") Instant from,
                                   @Param("to") Instant to);

    long countByOwnerUsernameAndWordIdAndSourceAndCreatedAtGreaterThanEqual(
            String username, Long wordId, XpSource source, Instant from);

    boolean existsByOwnerUsernameAndSourceAndCreatedAtGreaterThanEqual(String username, XpSource source, Instant from);

    /** Per user in {@code ids}: {userId, XP earned since from}; users with no XP are absent. */
    @Query("select e.owner.id, coalesce(sum(e.amount), 0) from XpEvent e "
            + "where e.owner.id in :ids and e.createdAt >= :from group by e.owner.id")
    List<Object[]> xpByOwnerSince(@Param("ids") Collection<Long> ids, @Param("from") Instant from);

    long countByOwnerUsernameAndSource(String username, XpSource source);
}
