package com.example.dictionary.repository;

import org.springframework.data.jpa.repository.Modifying;

import com.example.dictionary.model.ReviewLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface ReviewLogRepository extends JpaRepository<ReviewLog, Long> {

    /** Number of different words answered since {@code from}. */
    @Query("select count(distinct l.word.id) from ReviewLog l where l.owner.username = :username and l.answeredAt >= :from")
    long countDistinctWordsAnsweredSince(@Param("username") String username, @Param("from") Instant from);

    /** Per answer format: {format, total answers, correct answers}. */
    @Query("select l.answerFormat, count(l), sum(case when l.correct = true then 1 else 0 end) "
            + "from ReviewLog l where l.owner.username = :username group by l.answerFormat")
    List<Object[]> countByFormat(@Param("username") String username);

    /** Per owner: {owner id, answers, correct answers, last answer time}. */
    @Query("select l.owner.id, count(l), sum(case when l.correct = true then 1 else 0 end), max(l.answeredAt) "
            + "from ReviewLog l group by l.owner.id")
    List<Object[]> statsByOwner();

    /** Answers since {@code from} as {owner id, answeredAt}. */
    @Query("select l.owner.id, l.answeredAt from ReviewLog l where l.answeredAt >= :from")
    List<Object[]> answersSince(@Param("from") Instant from);

    /** Per answer format since {@code from}: {format, answers, correct answers}. */
    @Query("select l.answerFormat, count(l), sum(case when l.correct = true then 1 else 0 end) "
            + "from ReviewLog l where l.answeredAt >= :from group by l.answerFormat")
    List<Object[]> formatUsageSince(@Param("from") Instant from);

    /** Per word text (case-insensitive) with at least {@code min} answers: {word, answers, wrong answers}. */
    @Query("select min(l.word.english), count(l), sum(case when l.correct = false then 1 else 0 end) "
            + "from ReviewLog l group by lower(l.word.english) having count(l) >= :min")
    List<Object[]> wordDifficulty(@Param("min") long min);

    /** One user's latest answers as {answeredAt, english, correct, format}, newest first. */
    @Query("select l.answeredAt, l.word.english, l.correct, l.answerFormat from ReviewLog l "
            + "where l.owner.id = :ownerId order by l.answeredAt desc")
    List<Object[]> recentAnswers(@Param("ownerId") Long ownerId, Pageable pageable);

    boolean existsByOwnerUsernameAndClientId(String username, String clientId);

    /** Answers in {@code [from, to)} as {answeredAt, correct, wordId}. */
    @Query("select l.answeredAt, l.correct, l.word.id from ReviewLog l "
            + "where l.owner.username = :username and l.answeredAt >= :from and l.answeredAt < :to")
    List<Object[]> answersBetween(@Param("username") String username, @Param("from") Instant from,
                                  @Param("to") Instant to);

    /** Words answered for the first time since {@code from} (box 0 before the answer). */
    long countByOwnerUsernameAndStartBoxAndAnsweredAtGreaterThanEqual(String username, int startBox, Instant from);

    @Modifying
    @Query("delete from ReviewLog l where l.owner.id = :ownerId")
    int deleteByOwnerId(@Param("ownerId") Long ownerId);

}
