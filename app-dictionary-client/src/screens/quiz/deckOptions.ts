import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { ReviewSummary } from '../../types';
import { QuizMode } from '../../api/quizApi';

export interface DeckOption {
  mode: QuizMode;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  enabled: boolean;
}

/** The three word pools offered by the flashcard and matching games. */
export function buildDeckOptions(review: ReviewSummary | null, totalWords: number, favoriteCount = 0): DeckOption[] {
  const waiting = (review?.dueCount ?? 0) + (review?.newCount ?? 0);
  return [
    {
      mode: 'DUE',
      title: 'Takrorlash',
      subtitle:
        waiting > 0
          ? `${review?.dueCount ?? 0} ta takrorlash · ${review?.newCount ?? 0} ta yangi so'z`
          : "Bugun takrorlash uchun so'z yo'q",
      icon: 'repeat',
      color: colors.primary,
      enabled: waiting > 0,
    },
    {
      mode: 'WEAK',
      title: "Zaif so'zlar",
      subtitle: (review?.weakCount ?? 0) > 0 ? `${review?.weakCount} ta so'z ko'p xato qilingan` : "Hozircha zaif so'z yo'q",
      icon: 'flash-outline',
      color: colors.danger,
      enabled: (review?.weakCount ?? 0) > 0,
    },
    {
      mode: 'FAVORITES',
      title: "Sevimli so'zlar",
      subtitle: favoriteCount > 0 ? `Yulduzcha qo'yilgan ${favoriteCount} ta so'z` : "Hali sevimli so'z yo'q",
      icon: 'star',
      color: '#F59E0B',
      enabled: favoriteCount > 0,
    },
    {
      mode: 'ALL',
      title: "Tasodifiy so'zlar",
      subtitle: `Lug'atingizdan 20 tagacha so'z (${totalWords} ta ichidan)`,
      icon: 'shuffle-outline',
      color: colors.secondary,
      enabled: totalWords > 0,
    },
  ];
}
