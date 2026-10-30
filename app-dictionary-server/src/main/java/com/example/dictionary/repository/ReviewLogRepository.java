package com.example.dictionary.repository;

import com.example.dictionary.model.ReviewLog;
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

    boolean existsByOwnerUsernameAndClientId(String username, String clientId);

    /** Answers in {@code [from, to)} as {answeredAt, correct, wordId}. */
    @Query("select l.answeredAt, l.correct, l.word.id from ReviewLog l "
            + "where l.owner.username = :username and l.answeredAt >= :from and l.answeredAt < :to")
    List<Object[]> answersBetween(@Param("username") String username, @Param("from") Instant from,
                                  @Param("to") Instant to);

    /** Words answered for the first time since {@code from} (box 0 before the answer). */
    long countByOwnerUsernameAndStartBoxAndAnsweredAtGreaterThanEqual(String username, int startBox, Instant from);
}
