import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Button from '../../components/Button';
import { colors, themed } from '../../theme/colors';
import * as sentencesApi from '../../api/sentencesApi';
import { SentenceMode, SentenceStats, SentenceStatus } from '../../api/sentencesApi';
import * as wordsApi from '../../api/wordsApi';
import { Word } from '../../types';
import { extractErrorMessage } from '../../utils/errors';
import { Bar, IconBadge, SectionTitle, courseStyles } from '../learn/learnUi';
import SentenceView from '../quiz/SentenceView';

type IconName = keyof typeof Ionicons.glyphMap;

const MODES: { mode: SentenceMode; icon: IconName; title: string; sub: string; tone: string; empty: string }[] = [
  { mode: 'TODAY', icon: 'today', title: "Bugungi so'zlar", sub: "Bugun qo'shgan so'zlaringiz bilan", tone: '#0EA5E9', empty: "Bugun so'z qo'shilmagan" },
  { mode: 'WEAK', icon: 'flash', title: "Zaif so'zlar", sub: "Ko'p xato qilgan so'zlaringiz bilan", tone: '#EF4444', empty: "Hozircha zaif so'z yo'q" },
  { mode: 'ALL', icon: 'shuffle', title: "Barcha so'zlar", sub: "Butun lug'atingizdan tasodifiy", tone: '#10B981', empty: "So'z yo'q" },
];

const DAYS = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];

export default function SentencesScreen() {
  const [words, setWords] = useState<Word[]>([]);
  const [status, setStatus] = useState<SentenceStatus | null>(null);
  const [stats, setStats] = useState<SentenceStats | null>(null);
  const [ids, setIds] = useState<Record<SentenceMode, number[]>>({ TODAY: [], WEAK: [], ALL: [] });
  const [error, setError] = useState('');
  const [active, setActive] = useState<SentenceMode | null>(null);
  const [pool, setPool] = useState<Word[]>([]);
  const [session, setSession] = useState(0);

  const load = useCallback(() => {
    setError('');
    Promise.all([
      wordsApi.getWords(),
      sentencesApi.getSentenceStatus(),
      sentencesApi.getSentenceStats(),
      sentencesApi.getSentenceWords('TODAY'),
      sentencesApi.getSentenceWords('WEAK'),
      sentencesApi.getSentenceWords('ALL'),
    ])
      .then(([w, s, st, t, wk, al]) => {
        setWords(w);
        setStatus(s);
        setStats(st);
        setIds({ TODAY: t, WEAK: wk, ALL: al });
      })
      .catch((e) => setError(extractErrorMessage(e, "Ma'lumotni yuklab bo'lmadi")));
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!active) load();
    }, [active, load]),
  );

  if (active && status) {
    const m = MODES.find((x) => x.mode === active)!;
    return (
      <SentenceView
        key={session}
        words={pool}
        remaining={status.remainingToday}
        title={m.title}
        goal={{ done: status.doneToday, target: status.dailyGoal }}
        onExit={() => setActive(null)}
      />
    );
  }

  if (!status) {
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

  const start = (mode: SentenceMode) => {
    const set = new Set(ids[mode]);
    const list = words.filter((w) => set.has(w.id));
    if (!list.length) return;
    setPool(list);
    setSession((n) => n + 1);
    setActive(mode);
  };

  const goal = status.dailyGoal;
  const done = status.doneToday;
  const pct = Math.min(100, (done / goal) * 100);
  const max = Math.max(goal, ...(stats?.last7.map((d) => d.count) ?? [0]));

  return (
    <ScreenContainer>
      <Text style={styles.title}>Gap tuzish</Text>

      <View style={[courseStyles.surface, styles.goal]}>
        <View style={styles.goalTop}>
          <Text style={styles.goalLabel}>Bugungi maqsad</Text>
          <Text style={styles.goalNum}>
            {Math.min(done, goal)} <Text style={styles.goalOf}>/ {goal} ta gap</Text>
          </Text>
        </View>
        <Bar pct={pct} tone={pct >= 100 ? colors.secondary : colors.primary} height={8} />
        {pct >= 100 ? <Text style={styles.goalDone}>Maqsad bajarildi. Barakalla!</Text> : null}
      </View>

      {!status.enabled ? <Text style={styles.error}>Gap tekshirish hozircha sozlanmagan.</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <SectionTitle>Qaysi so'zlar bilan?</SectionTitle>
      <View style={courseStyles.surface}>
        {MODES.map((m, i) => {
          const n = ids[m.mode].length;
          const off = !status.enabled || n === 0;
          return (
            <Pressable
              key={m.mode}
              disabled={off}
              onPress={() => start(m.mode)}
              style={({ pressed }) => [styles.mode, i < MODES.length - 1 && courseStyles.rowDivider, off && { opacity: 0.5 }, pressed && { opacity: 0.7 }]}
            >
              <IconBadge name={m.icon} tone={m.tone} size={42} />
              <View style={{ flex: 1 }}>
                <Text style={styles.modeTitle}>{m.title}</Text>
                <Text style={styles.modeSub}>{n > 0 ? `${m.sub} · ${n} ta` : m.empty}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          );
        })}
      </View>

      {stats ? (
        <>
          <SectionTitle>Natijalar</SectionTitle>
          <View style={[courseStyles.surface, styles.facts]}>
            <Fact label="Jami gap" value={String(stats.total)} />
            <View style={styles.vline} />
            <Fact label="O'rtacha ball" value={stats.total ? String(stats.averageScore) : '—'} />
            <View style={styles.vline} />
            <Fact label="Yaxshi (70+)" value={String(stats.good)} />
          </View>
          <View style={[courseStyles.surface, styles.week]}>
            {stats.last7.map((d) => {
              const dt = new Date(`${d.date}T00:00:00`);
              return (
                <View key={d.date} style={styles.dayCol}>
                  <View style={[styles.dayBar, { height: Math.max(4, (d.count / max) * 56), backgroundColor: d.count >= goal ? colors.secondary : colors.primary, opacity: d.count ? 1 : 0.25 }]} />
                  <Text style={styles.dayNum}>{d.count}</Text>
                  <Text style={styles.dayName}>{DAYS[dt.getDay()]}</Text>
                </View>
              );
            })}
          </View>
          <Text style={styles.note}>Maqsad bajarilgan kunlar (oxirgi 30 kun): {stats.goalDays}</Text>
        </>
      ) : null}
    </ScreenContainer>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <Text style={styles.factValue}>{value}</Text>
      <Text style={styles.factLabel}>{label}</Text>
    </View>
  );
}

const styles = themed(() =>
  StyleSheet.create({
    title: { color: colors.text, fontSize: 28, fontWeight: '800', letterSpacing: -0.4, marginBottom: 14 },
    error: { color: colors.danger, marginVertical: 10 },
    goal: { padding: 16, gap: 10 },
    goalTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
    goalLabel: { color: colors.textMuted, fontSize: 14 },
    goalNum: { color: colors.text, fontSize: 22, fontWeight: '800', fontVariant: ['tabular-nums'] },
    goalOf: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
    goalDone: { color: colors.greenText, fontWeight: '700', fontSize: 13.5 },
    mode: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
    modeTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
    modeSub: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
    facts: { flexDirection: 'row', paddingVertical: 16 },
    fact: { flex: 1, alignItems: 'center', gap: 2 },
    vline: { width: StyleSheet.hairlineWidth, backgroundColor: colors.border },
    factValue: { color: colors.text, fontSize: 24, fontWeight: '800', fontVariant: ['tabular-nums'] },
    factLabel: { color: colors.textMuted, fontSize: 12.5 },
    week: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 14, marginTop: 10 },
    dayCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 3 },
    dayBar: { width: '70%', borderRadius: 5 },
    dayNum: { color: colors.text, fontSize: 12, fontWeight: '700' },
    dayName: { color: colors.textMuted, fontSize: 11 },
    note: { color: colors.textMuted, fontSize: 12.5, marginTop: 8 },
  }),
);
