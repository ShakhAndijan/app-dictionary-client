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
 * One lesson of the programming course (for now: frontend). Loaded from {@code resources/dev/*.json} on startup.
 * {@code theory} and {@code practice} are JSON text, {@code itemsJson} holds the exercises.
 */
@Entity
@Table(name = "dev_lessons",
        uniqueConstraints = @UniqueConstraint(name = "uk_dev_lesson_code", columnNames = "code"),
        indexes = @Index(name = "idx_dev_lesson_level_module", columnList = "level, module_key"))
public class DevLesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String code;

    /** JUNIOR, MIDDLE or SENIOR. */
    @Column(nullable = false, length = 10)
    private String level;

    /** Topic module, e.g. "internet". */
    @Column(name = "module_key", nullable = false, length = 40)
    private String moduleKey;

    @Column(nullable = false, length = 160)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String intro;

    @Column(columnDefinition = "TEXT")
    private String theory;

    /** Hands-on tasks to try outside the app (JSON list of strings). */
    @Column(columnDefinition = "TEXT")
    private String practice;

    @Column(name = "order_index", nullable = false)
    private int orderIndex;

    @Column(name = "items_json", nullable = false, columnDefinition = "TEXT")
    private String itemsJson;

    /** Coding labs (JSON list), null when the lesson has none. */
    @Column(name = "labs_json", columnDefinition = "TEXT")
    private String labsJson;

    protected DevLesson() {
    }

    public DevLesson(String code) {
        this.code = code;
    }

    public void apply(String level, String moduleKey, String title, String intro, String theory, String practice,
                      int orderIndex, String itemsJson) {
        this.level = level;
        this.moduleKey = moduleKey;
        this.title = title;
        this.intro = intro;
        this.theory = theory;
        this.practice = practice;
        this.orderIndex = orderIndex;
        this.itemsJson = itemsJson;
    }

    public void setLabsJson(String labsJson) { this.labsJson = labsJson; }
    public String getLabsJson() { return labsJson; }
    public String getCode() { return code; }
    public String getLevel() { return level; }
    public String getModuleKey() { return moduleKey; }
    public String getTitle() { return title; }
    public String getIntro() { return intro; }
    public String getTheory() { return theory; }
    public String getPractice() { return practice; }
    public int getOrderIndex() { return orderIndex; }
    public String getItemsJson() { return itemsJson; }
}
