import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Button from '../../components/Button';
import { colors, themed } from '../../theme/colors';
import * as learnApi from '../../api/learnApi';
import { LearnStats, SKILL_META, SKILL_ORDER } from '../../api/learnApi';
import { extractErrorMessage } from '../../utils/errors';
import { LearnStackParamList } from '../../navigation/types';
import { Bar, IconBadge, SKILL_ICON, SectionTitle, courseStyles } from './learnUi';

const MONTHS = ['yan', 'fev', 'mar', 'apr', 'may', 'iyun', 'iyul', 'avg', 'sen', 'okt', 'noy', 'dek'];

function when(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getDate()}-${MONTHS[d.getMonth()]}`;
}

export default function LearnStatsScreen() {
  const nav = useNavigation<NativeStackNavigationProp<LearnStackParamList>>();
  const [stats, setStats] = useState<LearnStats | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setError('');
    learnApi
      .getStats()
      .then(setStats)
      .catch((e) => setError(extractErrorMessage(e, "Statistikani yuklab bo'lmadi")));
  }, []);

  useFocusEffect(load);

  const recent = useMemo(
    () =>
      (stats?.skills ?? [])
        .flatMap((s) => s.recent.map((r) => ({ ...r, skill: s.skill })))
        .sort((a, b) => (a.at < b.at ? 1 : -1))
        .slice(0, 8),
    [stats],
  );
  const weakLessons = useMemo(
    () =>
      (stats?.skills ?? [])
        .flatMap((s) => s.weakLessons.map((w) => ({ ...w, skill: s.skill })))
        .sort((a, b) => a.bestScore - b.bestScore)
        .slice(0, 5),
    [stats],
  );

  if (!stats) {
    return (
      <ScreenContainer>
        {error ? (
          <>
            <Text style={styles.error}>{error}</Text>
            <Button title="Qayta urinish" onPress={load} />
          </>
        ) : (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 60 }} />
        )}
      </ScreenContainer>
    );
  }

  const accuracy = stats.answered ? Math.round((stats.correct / stats.answered) * 100) : null;
  const ordered = SKILL_ORDER.map((s) => stats.skills.find((x) => x.skill === s)).filter((x): x is NonNullable<typeof x> => !!x);
  // Only worth pointing at when that skill is really below the pass mark.
  const weakStat = stats.skills.find((s) => s.skill === stats.weakest);
  const weakest = stats.weakest && weakStat && weakStat.percent !== null && weakStat.percent < stats.passMark ? SKILL_META[stats.weakest] : null;
  const empty = stats.answered === 0 && stats.examsTaken === 0;

  return (
    <ScreenContainer>
      {stats.level ? <Text style={styles.levelNote}>{stats.level} daraja bo'yicha natijalaringiz</Text> : null}

      {empty ? (
        <View style={[courseStyles.surface, styles.empty]}>
          <Ionicons name="stats-chart" size={30} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Hozircha ma'lumot yo'q</Text>
          <Text style={styles.emptyText}>Bitta dars bajaring, natijalaringiz shu yerda ko'rinadi.</Text>
        </View>
      ) : (
        <>
          <View style={[courseStyles.surface, styles.facts]}>
            <Fact label="To'g'ri javoblar" value={accuracy === null ? '—' : `${accuracy}%`} note={`${stats.correct} / ${stats.answered}`} />
            <View style={styles.vline} />
            <Fact label="Faol kunlar" value={String(stats.activeDays)} />
            <View style={styles.vline} />
            <Fact label="Imtihonlar" value={String(stats.examsTaken)} />
          </View>

          {weakest && stats.weakest ? (
            <Pressable
              style={({ pressed }) => [styles.weak, pressed && { opacity: 0.85 }]}
              onPress={() => nav.navigate('LearnLessons', { skill: stats.weakest! })}
            >
              <IconBadge name={SKILL_ICON[stats.weakest]} tone={weakest.tone} size={42} />
              <View style={{ flex: 1 }}>
                <Text style={styles.weakTitle}>Eng ko'p mashq kerak: {weakest.label}</Text>
                <Text style={styles.weakSub}>Shu yo'nalishdan bir dars bajaring</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          ) : null}

          <SectionTitle>Yo'nalishlar bo'yicha</SectionTitle>
          <View style={courseStyles.surface}>
            {ordered.map((s, i) => {
              const m = SKILL_META[s.skill];
              return (
                <View key={s.skill} style={[styles.skillRow, i < ordered.length - 1 && courseStyles.rowDivider]}>
                  <IconBadge name={SKILL_ICON[s.skill]} tone={m.tone} size={38} />
                  <View style={{ flex: 1, gap: 6 }}>
                    <View style={styles.skillTop}>
                      <Text style={styles.skillName}>{m.label}</Text>
                      <Text style={styles.skillNum}>{s.percent === null ? '—' : `${s.percent}%`}</Text>
                    </View>
                    <Bar pct={s.percent ?? 0} tone={m.tone} mark={stats.passMark} />
                    <Text style={styles.skillSub}>
                      {s.lessonsPassed} / {s.lessonsTotal} dars{s.answered ? ` · ${s.correct} / ${s.answered} to'g'ri` : ''}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
          <Text style={styles.note}>Chiziq — {stats.passMark}% o'tish chegarasi.</Text>

          {weakLessons.length > 0 ? (
            <>
              <SectionTitle>Qayta bajarish kerak</SectionTitle>
              <View style={courseStyles.surface}>
                {weakLessons.map((w, i) => (
                  <Pressable
                    key={w.code}
                    style={({ pressed }) => [styles.listRow, i < weakLessons.length - 1 && courseStyles.rowDivider, pressed && { opacity: 0.7 }]}
                    onPress={() => nav.navigate('LearnPlay', { mode: 'lesson', code: w.code })}
                  >
                    <IconBadge name={SKILL_ICON[w.skill]} tone={SKILL_META[w.skill].tone} size={34} />
                    <Text style={styles.listTitle} numberOfLines={1}>
                      {w.title}
                    </Text>
                    <Text style={[styles.listScore, { color: colors.danger }]}>{w.bestScore}%</Text>
                  </Pressable>
                ))}
              </View>
            </>
          ) : null}

          {recent.length > 0 ? (
            <>
              <SectionTitle>So'nggi urinishlar</SectionTitle>
              <View style={courseStyles.surface}>
                {recent.map((r, i) => (
                  <View key={`${r.code}-${r.at}`} style={[styles.listRow, i < recent.length - 1 && courseStyles.rowDivider]}>
                    <Ionicons name={r.passed ? 'checkmark-circle' : 'close-circle'} size={22} color={r.passed ? colors.secondary : colors.danger} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.listTitle} numberOfLines={1}>
                        {r.title}
                      </Text>
                      <Text style={styles.skillSub}>
                        {SKILL_META[r.skill].label} · {when(r.at)}
                      </Text>
                    </View>
                    <Text style={styles.listScore}>{r.percent}%</Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}
        </>
      )}
    </ScreenContainer>
  );
}

function Fact({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <View style={styles.fact}>
      <Text style={styles.factValue}>{value}</Text>
      <Text style={styles.factLabel}>{label}</Text>
      {note ? <Text style={styles.factNote}>{note}</Text> : null}
    </View>
  );
}

const styles = themed(() =>
  StyleSheet.create({
    levelNote: { color: colors.textMuted, fontSize: 15, marginBottom: 14 },
    error: { color: colors.danger, marginVertical: 12 },
    facts: { flexDirection: 'row', paddingVertical: 18 },
    fact: { flex: 1, alignItems: 'center', gap: 2 },
    vline: { width: StyleSheet.hairlineWidth, backgroundColor: colors.border },
    factValue: { color: colors.text, fontSize: 26, fontWeight: '800', fontVariant: ['tabular-nums'] },
    factLabel: { color: colors.textMuted, fontSize: 12.5, textAlign: 'center' },
    factNote: { color: colors.textMuted, fontSize: 12, fontVariant: ['tabular-nums'] },
    weak: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.amberBg, borderRadius: 16, padding: 14, marginTop: 12 },
    weakTitle: { color: colors.amberText, fontSize: 15, fontWeight: '800' },
    weakSub: { color: colors.amberText, fontSize: 13, marginTop: 2, opacity: 0.85 },
    skillRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
    skillTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
    skillName: { color: colors.text, fontSize: 15.5, fontWeight: '700' },
    skillNum: { color: colors.text, fontSize: 15, fontWeight: '800', fontVariant: ['tabular-nums'] },
    skillSub: { color: colors.textMuted, fontSize: 12.5 },
    note: { color: colors.textMuted, fontSize: 12.5, marginTop: 8 },
    listRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14 },
    listTitle: { color: colors.text, fontSize: 15, fontWeight: '600', flex: 1 },
    listScore: { color: colors.text, fontWeight: '800', fontSize: 15, fontVariant: ['tabular-nums'] },
    empty: { alignItems: 'center', padding: 32, gap: 8 },
    emptyTitle: { color: colors.text, fontSize: 17, fontWeight: '800', marginTop: 4 },
    emptyText: { color: colors.textMuted, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  }),
);
