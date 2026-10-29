package com.example.dictionary.service;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Random;

import static org.assertj.core.api.Assertions.assertThat;

class DistractorPickerTest {

    @Test
    void prefersLookAlikesOverObviousOutsiders() {
        List<String> pool = List.of("olxo'ri", "olov", "olam", "kitob", "mushuk", "daraxt", "stol");
        for (int i = 0; i < 30; i++) {
            List<String> picked = DistractorPicker.pick("olma", pool, 1, new Random(i));
            assertThat(picked).hasSize(1);
            assertThat(picked.get(0)).isIn("olam", "olov");
        }
    }

    @Test
    void neverReturnsTheCorrectAnswerEvenWithDifferentCase() {
        List<String> picked = DistractorPicker.pick("Olma", List.of("olma", "OLMA", "kitob", "uy", "suv"), 3, new Random(1));
        assertThat(picked).containsExactlyInAnyOrder("kitob", "uy", "suv");
    }

    @Test
    void returnsFewerOptionsWhenThePoolIsSmall() {
        assertThat(DistractorPicker.pick("olma", List.of("kitob"), 3, new Random(1))).containsExactly("kitob");
    }
}
