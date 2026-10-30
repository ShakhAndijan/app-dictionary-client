import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import { colors, themed } from '../../theme/colors';
import * as progressApi from '../../api/progressApi';
import { Progress } from '../../api/progressApi';
import { TIER_META } from '../../utils/achievementTier';

export default function AchievementsScreen() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [error, setError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      progressApi
        .getProgress()
        .then((p) => {
          setProgress(p);
          setError(false);
        })
        .catch(() => setError(true));
    }, [])
  );

  if (!progress) {
    return (
      <ScreenContainer>
        {error ? (
          <Text style={styles.muted}>Yutuqlarni yuklab bo'lmadi</Text>
        ) : (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        )}
      </ScreenContainer>
    );
  }

  // Unlocked first, then the closest to unlocking.
  const sorted = [...progress.achievements].sort((a, b) => {
    if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
    return b.current / b.target - a.current / a.target;
  });

  return (
    <ScreenContainer>
      <Text style={styles.summary}>
        {progress.unlockedCount} / {progress.totalAchievements} yutuq ochilgan
      </Text>
      {sorted.map((a) => {
        const tier = TIER_META[a.tier];
        const pct = Math.min(100, Math.round((a.current / Math.max(1, a.target)) * 100));
        return (
          <Card key={a.code} style={styles.card}>
            <View style={styles.row}>
              <View
                style={[
                  styles.badge,
                  a.unlocked
                    ? { backgroundColor: `${tier.color}22`, borderColor: tier.color }
                    : { backgroundColor: colors.background, borderColor: colors.border },
                ]}
              >
                <Ionicons
                  name={a.unlocked ? a.icon : 'lock-closed'}
                  size={22}
                  color={a.unlocked ? tier.color : colors.textMuted}
                />
              </View>
              <View style={styles.body}>
                <View style={styles.titleRow}>
                  <Text style={styles.title}>{a.title}</Text>
                  <Text style={[styles.tier, { color: tier.color }]}>{tier.label}</Text>
                </View>
                <Text style={styles.desc}>{a.description}</Text>
                {a.unlocked ? (
                  <Text style={styles.done}>Ochilgan · +{a.xpReward} XP</Text>
                ) : (
                  <>
                    <View style={styles.track}>
                      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: tier.color }]} />
                    </View>
                    <Text style={styles.count}>
                      {a.current} / {a.target} · +{a.xpReward} XP
                    </Text>
                  </>
                )}
              </View>
            </View>
          </Card>
        );
      })}
    </ScreenContainer>
  );
}

const styles = themed(() => StyleSheet.create({
  muted: { color: colors.textMuted, textAlign: 'center', marginTop: 40 },
  loader: { marginTop: 40 },
  summary: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 12 },
  card: { marginBottom: 10 },
  row: { flexDirection: 'row', gap: 12 },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  title: { fontSize: 15, fontWeight: '700', color: colors.text, flexShrink: 1 },
  tier: { fontSize: 11, fontWeight: '800' },
  desc: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.border, marginTop: 10, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
  count: { fontSize: 11, color: colors.textMuted, marginTop: 4 },
  done: { fontSize: 12, fontWeight: '700', color: colors.secondary, marginTop: 8 },
}));
