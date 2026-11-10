package com.example.dictionary.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;

import java.io.InputStream;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class LearnServiceTest {

    private static LearnItem fill(String answer, List<String> also) {
        return new LearnItem("1", "FILL", "She ___ happy.", null, answer, also, null, null);
    }

    @Test
    void answerMatchingIgnoresCaseSpacesApostrophesAndEndPunctuation() {
        LearnItem item = fill("isn't", List.of("is not"));
        assertTrue(item.matches("  ISN’T. "));
        assertTrue(item.matches("is   not"));
        assertFalse(item.matches("is"));
        assertFalse(item.matches(""));
        assertFalse(item.matches(null));
    }

    @Test
    void choiceAnswerMustBeAmongOptions() {
        LearnItem bad = new LearnItem("1", "CHOICE", "x", List.of("a", "b"), "c", null, null, null);
        assertNotNull(bad.problem());
        LearnItem good = new LearnItem("1", "CHOICE", "x", List.of("a", "b"), "A", null, null, null);
        assertNull(good.problem());
    }

    @Test
    void orderWordsMustFormTheAnswer() {
        LearnItem good = new LearnItem("1", "ORDER", "x", null, "I am a teacher.", null, List.of("teacher", "I", "a", "am"), null);
        assertNull(good.problem());
        assertTrue(good.matches("i am a teacher"));
        LearnItem bad = new LearnItem("1", "ORDER", "x", null, "I am a teacher", null, List.of("I", "am", "a"), null);
        assertNotNull(bad.problem());
    }

    @Test
    void percentAndPassMarks() {
        assertEquals(0, LearnService.percent(0, 0));
        assertEquals(67, LearnService.percent(2, 3));
        assertTrue(LearnService.isPassed(70));
        assertFalse(LearnService.isPassed(69));
        assertFalse(LearnService.isPassed(null));
    }

    @Test
    void combineUsesWhicheverNumberExists() {
        assertNull(LearnService.combine(null, null));
        assertEquals(40, LearnService.combine(40, null));
        assertEquals(60, LearnService.combine(null, 60));
        assertEquals(50, LearnService.combine(40, 60));
    }

    @Test
    void bundledCourseFilesAreValid() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        Set<String> codes = new HashSet<>();
        for (org.springframework.core.io.Resource file : new org.springframework.core.io.support.PathMatchingResourcePatternResolver()
                .getResources("classpath:learn/*.json")) {
            try (InputStream in = file.getInputStream()) {
                LearnContentLoader.LessonFile[] lessons = mapper.readValue(in, LearnContentLoader.LessonFile[].class);
                assertTrue(lessons.length > 0);
                for (LearnContentLoader.LessonFile lesson : lessons) {
                    assertNull(LearnContentLoader.problem(lesson), lesson.code());
                    assertTrue(codes.add(lesson.code()), "duplicate lesson code " + lesson.code());
                }
            }
        }
        assertTrue(codes.size() > 100);
    }

    @Test
    void spokenAnswersAreMatchedLoosely() {
        LearnItem item = new LearnItem("1", "SPEAK", "I'm from Uzbekistan.", null, "I'm from Uzbekistan.", null, null, null);
        assertTrue(item.matches("I am from Uzbekistan"));
        assertTrue(item.matches("i'm from uzbekistan please"));
        assertFalse(item.matches("hello"));
        assertFalse(item.matches("I like tea"));
        assertFalse(item.matches(""));
    }
}
