import { Ionicons } from '@expo/vector-icons';
import apiClient from './client';

export type AchievementTier = 'BRONZE' | 'SILVER' | 'GOLD';

export interface Achievement {
  code: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  tier: AchievementTier;
  xpReward: number;
  current: number;
  target: number;
  unlocked: boolean;
  unlockedAt: string | null;
  justUnlocked: boolean;
}

export interface Progress {
  totalXp: number;
  level: number;
  levelTitle: string;
  xpIntoLevel: number;
  xpForLevel: number;
  todayXp: number;
  weekXp: number;
  unlockedCount: number;
  totalAchievements: number;
  achievements: Achievement[];
}

export function getProgress() {
  return apiClient.get<Progress>('/progress').then((r) => r.data);
}

export function markAchievementsSeen() {
  return apiClient.post('/progress/seen').then(() => undefined);
}
