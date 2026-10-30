import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import { colors, themed } from '../../theme/colors';
import * as statsApi from '../../api/statsApi';
import { WeeklyReport, WeeklyTotals } from '../../api/statsApi';

const WEEKDAYS = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];
const MONTHS = ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek'];
const BAR_AREA = 90;

function shortDate(iso: string): string {
  const [, m, d] = iso.split('-').map(Number);
  return `${d}-${MONTHS[m - 1]}`;
}

/** Arrow and colour for "this week vs. last week"; nothing to compare when both are zero. */
function Delta({ now, before, suffix = '' }: { now: number; before: number; suffix?: string }) {
  const diff = Math.round((now - before) * 10) / 10;
  if (diff === 0) return <Text style={styles.deltaFlat}>o'zgarmagan</Text>;
  const up = diff > 0;
  return (
    <Text style={[styles.delta, { color: up ? colors.secondary : colors.danger }]}>
      {up ? '▲' : '▼'} {Math.abs(diff)}
      {suffix}
    </Text>
  );
}

function Tile({
  label,
  value,
  now,
  before,
  suffix,
}: {
  label: string;
  value: string;
  now: number;
  before: number;
  suffix?: string;
}) {
  return (
    <View style={styles.tile}>
      <Text style={styles.tileValue}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
      <Delta now={now} before={before} suffix={suffix} />
    </View>
  );
}

function verdict(t: WeeklyTotals, p: WeeklyTotals): string {
  if (t.answers === 0 && t.wordsAdded === 0) return "Bu hafta hali faollik yo'q. Bugun boshlang!";
  if (t.answers > p.answers && t.accuracyPercent >= p.accuracyPercent) return "Ajoyib hafta: ko'proq va aniqroq!";
  if (t.answers > p.answers) return "O'tgan haftadan ko'proq mashq qildingiz.";
  if (t.accuracyPercent > p.accuracyPercent) return "Aniqlik oshdi, davom eting!";
  return 'Barqaror davom eting, har kun bir oz.';
}

export default function WeeklyReportScreen() {
  const [weeksBack, setWeeksBack] = useState(0);
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback((back: number) => {
    setError(false);
    statsApi
      .getWeeklyReport(back)
      .then(setReport)
      .catch(() => setError(true));
  }, []);

  useFocusEffect(
    useCallback(() => {
      load(weeksBack);
    }, [load, weeksBack])
  );

  const go = (back: number) => {
    setReport(null);
    setWeeksBack(back);
  };

  const header = (
    <View style={styles.nav}>
      <Pressable style={styles.navBtn} onPress={() => go(weeksBack + 1)} hitSlop={8}>
        <Ionicons name="chevron-back" size={20} color={colors.text} />
      </Pressable>
      <View style={styles.navCenter}>
        <Text style={styles.navTitle}>
          {weeksBack === 0 ? 'Shu hafta' : weeksBack === 1 ? "O'tgan hafta" : `${weeksBack} hafta oldin`}
        </Text>
        {report && (
          <Text style={styles.navRange}>
            {shortDate(report.weekStart)} – {shortDate(report.weekEnd)}
          </Text>
        )}
      </View>
      <Pressable
        style={[styles.navBtn, weeksBack === 0 && styles.navBtnOff]}
        disabled={weeksBack === 0}
        onPress={() => go(weeksBack - 1)}
        hitSlop={8}
      >
        <Ionicons name="chevron-forward" size={20} color={colors.text} />
      </Pressable>
    </View>
  );

  if (!report) {
    return (
      <ScreenContainer>
        {header}
        {error ? (
          <Text style={styles.muted}>Hisobotni yuklab bo'lmadi</Text>
        ) : (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        )}
      </ScreenContainer>
    );
  }

  const t = report.totals;
  const p = report.previous;
  const maxAnswers = Math.max(1, ...report.days.map((d) => d.answers));

  return (
    <ScreenContainer>
      {header}

      <Card style={styles.card}>
        <Text style={styles.verdict}>{verdict(t, p)}</Text>
        <Text style={styles.verdictSub}>
          {t.activeDays} / 7 kun faol · maqsad {t.goalDays} kun bajarildi
        </Text>
      </Card>

      <View style={styles.grid}>
        <Tile label="Javoblar" value={String(t.answers)} now={t.answers} before={p.answers} />
        <Tile
          label="Aniqlik"
          value={`${t.accuracyPercent}%`}
          now={t.accuracyPercent}
          before={p.accuracyPercent}
          suffix="%"
        />
        <Tile label="XP" value={String(t.xp)} now={t.xp} before={p.xp} />
        <Tile label="Yangi so'zlar" value={String(t.wordsAdded)} now={t.wordsAdded} before={p.wordsAdded} />
        <Tile
          label="Mashq qilingan so'z"
          value={String(t.wordsPracticed)}
          now={t.wordsPracticed}
          before={p.wordsPracticed}
        />
        <Tile label="Maqsad kunlari" value={String(t.goalDays)} now={t.goalDays} before={p.goalDays} />
      </View>
      <Text style={styles.hint}>Yashil/qizil belgi o'tgan haftaga nisbatan farqni ko'rsatadi.</Text>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Kunlar bo'yicha javoblar</Text>
        <View style={styles.chart}>
          {report.days.map((d, i) => {
            const h = d.answers === 0 ? 3 : Math.max(6, Math.round((d.answers / maxAnswers) * BAR_AREA));
            const best = d.date === report.bestDay;
            return (
              <View key={d.date} style={styles.barCol}>
                <Text style={styles.barValue}>{d.answers > 0 ? d.answers : ''}</Text>
                <View
                  style={[
                    styles.bar,
                    { height: h, backgroundColor: best ? colors.secondary : d.answers ? colors.primary : colors.border },
                  ]}
                />
                <Text style={[styles.barLabel, best && styles.barLabelBest]}>{WEEKDAYS[i]}</Text>
              </View>
            );
          })}
        </View>
        {report.bestDay && (
          <Text style={styles.best}>Eng faol kun: {shortDate(report.bestDay)}</Text>
        )}
      </Card>
    </ScreenContainer>
  );
}

const styles = themed(() => StyleSheet.create({
  muted: { color: colors.textMuted, textAlign: 'center', marginTop: 40 },
  loader: { marginTop: 40 },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnOff: { opacity: 0.3 },
  navCenter: { alignItems: 'center' },
  navTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  navRange: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  card: { marginBottom: 12 },
  verdict: { fontSize: 16, fontWeight: '800', color: colors.text },
  verdictSub: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 6 },
  tile: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
  },
  tileValue: { fontSize: 24, fontWeight: '800', color: colors.text },
  tileLabel: { fontSize: 12, color: colors.textMuted, marginTop: 2, marginBottom: 6 },
  delta: { fontSize: 12, fontWeight: '800' },
  deltaFlat: { fontSize: 12, color: colors.textMuted },
  hint: { fontSize: 11, color: colors.textMuted, marginBottom: 14 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 12 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: BAR_AREA + 40 },
  barCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
  bar: { width: 18, borderRadius: 6 },
  barValue: { fontSize: 11, fontWeight: '700', color: colors.textMuted, height: 14 },
  barLabel: { fontSize: 11, color: colors.textMuted },
  barLabelBest: { color: colors.secondary, fontWeight: '800' },
  best: { fontSize: 12, color: colors.textMuted, marginTop: 12, textAlign: 'center' },
}));
