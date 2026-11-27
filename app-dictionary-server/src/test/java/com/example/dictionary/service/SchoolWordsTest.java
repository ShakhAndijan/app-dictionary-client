package com.example.dictionary.service;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SchoolWordsTest {

    private static LearnItem translation(String uzbek, String answer) {
        return new LearnItem("1", "FILL", "Inglizchaga tarjima qiling: " + uzbek, null, answer, null, null, null);
    }

    @Test
    void schoolChildrenArePupilsOrStudents() {
        LearnItem students = translation("Sinfimizda yigirma besh o'quvchi bor.", "There are twenty five students in our class");
        assertThat(students.matches("there are twenty five pupils in our class")).isTrue();

        LearnItem pupils = translation("Bizning sinfda o'ttiz o'quvchi bor.", "There are thirty pupils in our class");
        assertThat(pupils.matches("There are thirty students in our class.")).isTrue();
    }

    @Test
    void universityStudentsAreNotPupils() {
        LearnItem item = translation("Talabalar yotoqxonada birga yashaydilar.", "The students live together in the dormitory");
        assertThat(item.matches("The pupils live together in the dormitory")).isFalse();
    }
}
