import { AchievementTier } from '../api/progressApi';

export const TIER_META: Record<AchievementTier, { label: string; color: string }> = {
  BRONZE: { label: 'Bronza', color: '#C2753A' },
  SILVER: { label: 'Kumush', color: '#8A94A6' },
  GOLD: { label: 'Oltin', color: '#E5A100' },
};
