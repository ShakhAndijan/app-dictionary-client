import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, themed } from '../theme/colors';
import * as progressApi from '../api/progressApi';
import { Achievement } from '../api/progressApi';
import { onProgressCheck } from '../services/progressEvents';
import { TIER_META } from '../utils/achievementTier';
import Button from './Button';

/** Watches for newly unlocked achievements and congratulates the user once for each batch. */
export default function AchievementCelebration() {
  const [queue, setQueue] = useState<Achievement[]>([]);
  const [levelUp, setLevelUp] = useState<{ level: number; title: string } | null>(null);
  const checking = useRef(false);
  const lastLevel = useRef<number | null>(null);

  const check = useCallback(async () => {
    if (checking.current) return;
    checking.current = true;
    try {
      const p = await progressApi.getProgress();
      const fresh = p.achievements.filter((a) => a.justUnlocked);
      if (lastLevel.current != null && p.level > lastLevel.current) {
        setLevelUp({ level: p.level, title: p.levelTitle });
      }
      lastLevel.current = p.level;
      if (fresh.length > 0) {
        setQueue(fresh);
        progressApi.markAchievementsSeen().catch(() => undefined);
      }
    } catch {
      // Celebrations are a bonus; never bother the user when the check fails.
    } finally {
      checking.current = false;
    }
  }, []);

  useEffect(() => {
    check();
    return onProgressCheck(check);
  }, [check]);

  const current = queue[0];
  const showLevel = !current && levelUp;
  const tier = current ? TIER_META[current.tier] : null;

  return (
    <Modal visible={!!current || !!showLevel} transparent animationType="fade" onRequestClose={() => undefined}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {current && tier ? (
            <>
              <Text style={styles.kicker}>YANGI YUTUQ!</Text>
              <View style={[styles.badge, { backgroundColor: `${tier.color}22`, borderColor: tier.color }]}>
                <Ionicons name={current.icon} size={44} color={tier.color} />
              </View>
              <Text style={styles.title}>{current.title}</Text>
              <Text style={styles.desc}>{current.description}</Text>
              <View style={styles.rewardPill}>
                <Ionicons name="flash" size={14} color={colors.primary} />
                <Text style={styles.rewardText}>+{current.xpReward} XP</Text>
              </View>
              <Text style={[styles.tier, { color: tier.color }]}>{tier.label} yutuq</Text>
              {queue.length > 1 && <Text style={styles.more}>Yana {queue.length - 1} ta yutuq kutmoqda</Text>}
              <Button
                title={queue.length > 1 ? 'Keyingisi' : 'Zo\'r!'}
                onPress={() => setQueue((q) => q.slice(1))}
                style={styles.btn}
              />
            </>
          ) : (
            levelUp && (
              <>
                <Text style={styles.kicker}>YANGI DARAJA!</Text>
                <View style={[styles.badge, { backgroundColor: `${colors.primary}1A`, borderColor: colors.primary }]}>
                  <Text style={styles.levelNumber}>{levelUp.level}</Text>
                </View>
                <Text style={styles.title}>{levelUp.title}</Text>
                <Text style={styles.desc}>Tabriklaymiz, {levelUp.level}-darajaga ko'tarildingiz!</Text>
                <Button title="Davom etish" onPress={() => setLevelUp(null)} style={styles.btn} />
              </>
            )
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = themed(() => StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  kicker: { fontSize: 12, fontWeight: '800', letterSpacing: 1.5, color: colors.primary, marginBottom: 16 },
  badge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  levelNumber: { fontSize: 44, fontWeight: '800', color: colors.primary },
  title: { fontSize: 20, fontWeight: '800', color: colors.text, textAlign: 'center' },
  desc: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginTop: 6 },
  rewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${colors.primary}1A`,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 16,
  },
  rewardText: { fontSize: 14, fontWeight: '800', color: colors.primary },
  tier: { fontSize: 12, fontWeight: '700', marginTop: 10 },
  more: { fontSize: 12, color: colors.textMuted, marginTop: 8 },
  btn: { marginTop: 20, alignSelf: 'stretch' },
}));
