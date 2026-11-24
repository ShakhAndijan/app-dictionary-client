package com.example.dictionary.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

/**
 * A coding lab: the learner writes JavaScript in the browser, each test evaluates {@code call} after the learner's code
 * and compares it with the {@code expect} expression. {@code solution} is only served on request.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record DevLab(String id, String title, String task, String starter, List<Test> tests, String hint,
                     String solution, String kind, String setup) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Test(String call, String expect) {
    }

    String problem() {
        if (id == null || id.isBlank()) return "lab without id";
        if (task == null || task.isBlank()) return "lab " + id + " has no task";
        if (tests == null || tests.isEmpty()) return "lab " + id + " has no tests";
        for (Test t : tests) {
            if (t.call() == null || t.call().isBlank() || t.expect() == null) return "lab " + id + " has a bad test";
        }
        if (solution == null || solution.isBlank()) return "lab " + id + " has no solution";
        return null;
    }
}
