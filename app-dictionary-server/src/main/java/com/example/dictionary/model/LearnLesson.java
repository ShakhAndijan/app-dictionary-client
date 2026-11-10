package com.example.dictionary.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

/**
 * One topic of the course: a short explanation plus a set of exercises (kept as JSON text in {@code itemsJson}).
 * Lessons are loaded from {@code resources/learn/*.json} on startup, so adding content never needs a migration.
 */
@Entity
@Table(name = "learn_lessons",
        uniqueConstraints = @UniqueConstraint(name = "uk_learn_lesson_code", columnNames = "code"),
        indexes = @Index(name = "idx_learn_lesson_level_skill", columnList = "level, skill"))
public class LearnLesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String code;

    @Column(nullable = false, length = 2)
    private String level;

    /** READING, LISTENING, SPEAKING, WRITING or GRAMMAR. */
    @Column(nullable = false, length = 20)
    private String skill;

    @Column(nullable = false, length = 120)
    private String topic;

    @Column(nullable = false, length = 160)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String intro;

    /** Reading text shared by all items of a reading lesson. */
    @Column(columnDefinition = "TEXT")
    private String passage;

    /** Text the app reads aloud (text-to-speech) in a listening lesson. */
    @Column(name = "audio_text", columnDefinition = "TEXT")
    private String audioText;

    @Column(name = "order_index", nullable = false)
    private int orderIndex;

    @Column(name = "items_json", nullable = false, columnDefinition = "TEXT")
    private String itemsJson;

    protected LearnLesson() {
        // Required by JPA.
    }

    public LearnLesson(String code) {
        this.code = code;
    }

    public void apply(String level, String skill, String topic, String title, String intro, String passage,
                      String audioText, int orderIndex, String itemsJson) {
        this.level = level;
        this.skill = skill;
        this.topic = topic;
        this.title = title;
        this.intro = intro;
        this.passage = passage;
        this.audioText = audioText;
        this.orderIndex = orderIndex;
        this.itemsJson = itemsJson;
    }

    public String getCode() { return code; }
    public String getLevel() { return level; }
    public String getSkill() { return skill; }
    public String getTopic() { return topic; }
    public String getTitle() { return title; }
    public String getIntro() { return intro; }
    public String getPassage() { return passage; }
    public String getAudioText() { return audioText; }
    public int getOrderIndex() { return orderIndex; }
    public String getItemsJson() { return itemsJson; }
}
