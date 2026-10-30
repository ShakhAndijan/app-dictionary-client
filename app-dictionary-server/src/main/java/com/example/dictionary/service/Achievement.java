package com.example.dictionary.service;

/** Every achievement a user can unlock. A definition is just "metric reaches target"; the XP reward follows the tier. */
public enum Achievement {

    FIRST_WORD(Metric.WORDS, 1, Tier.BRONZE, "Birinchi qadam", "Birinchi so'zingizni qo'shing", "footsteps-outline"),
    WORDS_50(Metric.WORDS, 50, Tier.SILVER, "Lug'at boshlandi", "50 ta so'z qo'shing", "library-outline"),
    WORDS_250(Metric.WORDS, 250, Tier.GOLD, "Katta lug'at", "250 ta so'z qo'shing", "book-outline"),

    CORRECT_100(Metric.CORRECT_ANSWERS, 100, Tier.BRONZE, "Yuzlik", "100 ta to'g'ri javob bering", "checkmark-done-outline"),
    CORRECT_1000(Metric.CORRECT_ANSWERS, 1000, Tier.SILVER, "Mingta javob", "1000 ta to'g'ri javob bering", "checkmark-done-circle-outline"),
    CORRECT_5000(Metric.CORRECT_ANSWERS, 5000, Tier.GOLD, "Mashq ustasi", "5000 ta to'g'ri javob bering", "medal-outline"),

    MASTERED_10(Metric.MASTERED, 10, Tier.BRONZE, "O'zlashtirdim", "10 ta so'zni o'zlashtiring", "ribbon-outline"),
    MASTERED_50(Metric.MASTERED, 50, Tier.SILVER, "Mustahkam xotira", "50 ta so'zni o'zlashtiring", "school-outline"),
    MASTERED_200(Metric.MASTERED, 200, Tier.GOLD, "So'z bilimdoni", "200 ta so'zni o'zlashtiring", "diamond-outline"),

    STREAK_3(Metric.STREAK, 3, Tier.BRONZE, "Izchillik", "3 kun ketma-ket mashq qiling", "flame-outline"),
    STREAK_7(Metric.STREAK, 7, Tier.SILVER, "Haftalik seriya", "7 kun ketma-ket mashq qiling", "flame"),
    STREAK_30(Metric.STREAK, 30, Tier.GOLD, "Temir iroda", "30 kun ketma-ket mashq qiling", "bonfire-outline"),

    GOAL_5(Metric.GOAL_DAYS, 5, Tier.BRONZE, "Maqsad egasi", "Kunlik maqsadni 5 marta bajaring", "flag-outline"),
    GOAL_30(Metric.GOAL_DAYS, 30, Tier.GOLD, "Maqsad ustasi", "Kunlik maqsadni 30 marta bajaring", "trophy-outline"),

    LISTENER(Metric.LISTENING_CORRECT, 50, Tier.SILVER, "Quloq", "Eshitib yozishda 50 ta to'g'ri javob bering", "headset-outline"),
    CHOICE_PRO(Metric.CHOICE_CORRECT, 100, Tier.SILVER, "Variantli usta", "Variantli testda 100 ta to'g'ri javob bering", "list-outline"),
    MATCHER(Metric.MATCHING_CORRECT, 100, Tier.SILVER, "Juftlovchi", "Juftlarni moslashda 100 ta so'zni to'g'ri moslang", "git-compare-outline"),
    SPEEDSTER(Metric.SPEED_ANSWERS, 100, Tier.SILVER, "Chaqqon", "Tez raundda 100 ta javob bering", "timer-outline"),
    CARD_FAN(Metric.FLASHCARD_ANSWERS, 100, Tier.SILVER, "Fleshkart ishqibozi", "Fleshkartda 100 ta karta ko'ring", "layers-outline"),

    STARRED(Metric.FAVORITES, 10, Tier.BRONZE, "Sevimlilar", "10 ta so'zga yulduzcha qo'ying", "star-outline"),
    ILLUSTRATOR(Metric.IMAGES, 5, Tier.BRONZE, "Rassom", "5 ta so'zga rasm qo'shing", "image-outline"),

    LEVEL_5(Metric.LEVEL, 5, Tier.SILVER, "5-daraja", "5-darajaga yeting", "arrow-up-circle-outline"),
    LEVEL_10(Metric.LEVEL, 10, Tier.GOLD, "10-daraja", "10-darajaga yeting", "rocket-outline");

    /** What an achievement counts. */
    public enum Metric {
        WORDS, CORRECT_ANSWERS, MASTERED, STREAK, GOAL_DAYS,
        LISTENING_CORRECT, CHOICE_CORRECT, MATCHING_CORRECT, SPEED_ANSWERS, FLASHCARD_ANSWERS,
        FAVORITES, IMAGES, LEVEL
    }

    public enum Tier {
        BRONZE(20), SILVER(50), GOLD(100);

        private final int xpReward;

        Tier(int xpReward) {
            this.xpReward = xpReward;
        }

        public int xpReward() {
            return xpReward;
        }
    }

    private final Metric metric;
    private final int target;
    private final Tier tier;
    private final String title;
    private final String description;
    private final String icon;

    Achievement(Metric metric, int target, Tier tier, String title, String description, String icon) {
        this.metric = metric;
        this.target = target;
        this.tier = tier;
        this.title = title;
        this.description = description;
        this.icon = icon;
    }

    public Metric metric() {
        return metric;
    }

    public int target() {
        return target;
    }

    public Tier tier() {
        return tier;
    }

    public String title() {
        return title;
    }

    public String description() {
        return description;
    }

    public String icon() {
        return icon;
    }

    public int xpReward() {
        return tier.xpReward();
    }
}
