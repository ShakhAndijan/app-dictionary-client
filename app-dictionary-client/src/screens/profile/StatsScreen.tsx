import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import { colors, themed } from '../../theme/colors';
import { DailyStats, MonthlyStats, ReviewSummary, StatsSummary, Word } from '../../types';
import * as statsApi from '../../api/statsApi';
import * as reviewApi from '../../api/reviewApi';
import * as wordsApi from '../../api/wordsApi';

type Mode = 'daily' | 'monthly';

interface Row {
  key: string;
  label: string;
  shortLabel: string;
  wordsAdded: number;
  quizzesTaken: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracyPercent: number;
}

const CHART_HEIGHT = 120;
const CHART_POINTS = 7;
const MONTH_NAMES = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];

// Server dates are ISO ("2026-10-28" / "2026-10"); format them without Date to avoid timezone shifts.
function formatDay(iso: string) {
  const [, m, d] = iso.split('-').map(Number);
  return { label: `${d}-${MONTH_NAMES[m - 1]}`, shortLabel: `${d}.${String(m).padStart(2, '0')}` };
}

function formatMonth(iso: string) {
  const [y, m] = iso.split('-').map(Number);
  return { label: `${MONTH_NAMES[m - 1]} ${y}`, shortLabel: MONTH_NAMES[m - 1] };
}

function isoDay(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// The last `count` calendar days, oldest first, with zeros for days the user was not active, so the weekly
// chart always shows a full week instead of only the active days.
function lastDaysRows(daily: DailyStats[], count: number): Row[] {
  const byDate = new Map(daily.map((d) => [d.date, d]));
  const rows: Row[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = isoDay(d);
    const r = byDate.get(iso);
    rows.push({
      key: iso,
      ...formatDay(iso),
      wordsAdded: r?.wordsAdded ?? 0,
      quizzesTaken: r?.quizzesTaken ?? 0,
      correctAnswers: r?.correctAnswers ?? 0,
      incorrectAnswers: r?.incorrectAnswers ?? 0,
      accuracyPercent: r?.accuracyPercent ?? 0,
    });
  }
  return rows;
}

function toRows(mode: Mode, daily: DailyStats[], monthly: MonthlyStats[]): Row[] {
  const source = mode === 'daily' ? daily : monthly;
  return source.map((r) => {
    const iso = mode === 'daily' ? (r as DailyStats).date : (r as MonthlyStats).month;
    const fmt = mode === 'daily' ? formatDay(iso) : formatMonth(iso);
    return { key: iso, ...fmt, ...r };
  });
}

export default function StatsScreen() {
  const [mode, setMode] = useState<Mode>('daily');
  const [daily, setDaily] = useState<DailyStats[]>([]);
  const [monthly, setMonthly] = useState<MonthlyStats[]>([]);
  const [summary, setSummary] = useState<StatsSummary | null>(null);
  const [review, setReview] = useState<ReviewSummary | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      // The extra cards are optional: if they fail to load, the rest of the screen still works.
      const [d, m, s, r, w] = await Promise.all([
        statsApi.getDailyStats(),
        statsApi.getMonthlyStats(),
        statsApi.getStatsSummary(),
        reviewApi.getReviewSummary().catch(() => null),
        wordsApi.getWords().catch(() => null),
      ]);
      setDaily(d);
      setMonthly(m);
      setSummary(s);
      setReview(r);
      setWords(w ?? []);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const rows = toRows(mode, daily, monthly);
  const chartRows = mode === 'daily' ? lastDaysRows(daily, CHART_POINTS) : rows.slice(-CHART_POINTS);
  const listRows = [...rows].reverse();

  return (
    <ScreenContainer>
      {!loading && !failed && summary && (
        <>
          {review && <TodayCard review={review} streak={summary.currentStreak} />}
          {review && review.totalWords > 0 && <WordStateCard review={review} />}
        </>
      )}

      <View style={styles.toggleRow}>
        <ToggleButton label="Kunlik" active={mode === 'daily'} onPress={() => setMode('daily')} />
        <ToggleButton label="Oylik" active={mode === 'monthly'} onPress={() => setMode('monthly')} />
      </View>

      {loading && <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />}

      {!loading && failed && (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Statistikani yuklab bo'lmadi</Text>
          <Pressable onPress={load} style={styles.retryBtn}>
            <Text style={styles.retryText}>Qayta urinish</Text>
          </Pressable>
        </View>
      )}

      {!loading && !failed && summary && (
        <>
          <SummaryGrid summary={summary} />
          <FormatBreakdown formats={summary.formats ?? []} />
          <HardWordsCard words={words} />

          {rows.length === 0 ? (
            <Text style={styles.emptyText}>
              {mode === 'daily' ? "Hali faol kunlar yo'q" : "Hali faol oylar yo'q"}. So'z qo'shing yoki test ishlang.
            </Text>
          ) : (
            <>
              <Card style={styles.chartCard}>
                <Text style={styles.sectionTitle}>
                  {mode === 'daily' ? 'Oxirgi 7 kun: javoblar' : 'Oxirgi faol oylar: javoblar'}
                </Text>
                <BarChart rows={chartRows} />
                <View style={styles.legend}>
                  <LegendDot color={colors.secondary} label="To'g'ri" />
                  <LegendDot color={colors.danger} label="Xato" />
                </View>
              </Card>

              <Text style={styles.sectionTitle}>{mode === 'daily' ? 'Kunlar bo‘yicha' : 'Oylar bo‘yicha'}</Text>
              {listRows.map((row) => (
                <PeriodCard key={row.key} row={row} />
              ))}
            </>
          )}
        </>
      )}
    </ScreenContainer>
  );
}

function TodayCard({ review, streak }: { review: ReviewSummary; streak: number }) {
  const goal = Math.max(1, review.dailyGoal);
  const done = review.todayDone;
  const reached = done >= goal;
  const pct = Math.min(100, Math.round((done / goal) * 100));
  const waiting = review.dueCount + review.newCount;
  const accent = reached ? colors.secondary : colors.primary;
  return (
    <Card style={styles.todayCard}>
      <View style={styles.todayTop}>
        <View style={[styles.todayIcon, { backgroundColor: `${accent}1A` }]}>
          <Ionicons name={reached ? 'trophy' : 'flag'} size={22} color={accent} />
        </View>
        <View style={styles.todayText}>
          <Text style={styles.todayTitle}>{reached ? 'Bugungi maqsad bajarildi!' : 'Bugungi maqsad'}</Text>
          <Text style={styles.todaySub}>
            {reached
              ? 'Ajoyib ish, shu tempni saqlang'
              : waiting > 0
              ? `${waiting} ta so'z takrorlashni kutyapti`
              : "Yangi so'z qo'shib mashq qiling"}
          </Text>
        </View>
        <View style={styles.streakBadge}>
          <Ionicons name="flame" size={16} color="#F59E0B" />
          <Text style={styles.streakText}>{streak}</Text>
        </View>
      </View>
      <View style={styles.todayNumbers}>
        <Text style={[styles.todayDone, { color: accent }]}>{done}</Text>
        <Text style={styles.todayGoal}> / {review.dailyGoal} so'z</Text>
        <Text style={[styles.todayPct, { color: accent }]}>{pct}%</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: accent }]} />
      </View>
    </Card>
  );
}

const STATE_SEGMENTS = themed(() => [
  { key: 'masteredCount', label: "O'zlashtirilgan", color: colors.secondary },
  { key: 'learningCount', label: "O'rganilmoqda", color: '#F59E0B' },
  { key: 'unseenCount', label: 'Yangi', color: colors.border },
] as const);

function WordStateCard({ review }: { review: ReviewSummary }) {
  // `newCount` in the summary is today's allowance of new words, not all unseen words, so derive the rest.
  const unseen = Math.max(0, review.totalWords - review.learningCount - review.masteredCount);
  const counts = { masteredCount: review.masteredCount, learningCount: review.learningCount, unseenCount: unseen };
  const total = Math.max(1, review.totalWords);
  const masteredPct = Math.round((review.masteredCount / total) * 100);
  return (
    <Card style={styles.stateCard}>
      <View style={styles.stateHeader}>
        <Text style={styles.sectionTitleInline}>So'zlar holati</Text>
        <Text style={styles.stateTotal}>{review.totalWords} ta so'z</Text>
      </View>
      <View style={styles.stateBar}>
        {STATE_SEGMENTS.map((seg) =>
          counts[seg.key] > 0 ? (
            <View key={seg.key} style={{ flex: counts[seg.key], backgroundColor: seg.color }} />
          ) : null
        )}
      </View>
      <View style={styles.stateLegend}>
        {STATE_SEGMENTS.map((seg) => (
          <View key={seg.key} style={styles.stateLegendItem}>
            <View style={[styles.legendDot, { backgroundColor: seg.color }]} />
            <Text style={styles.stateLegendValue}>{counts[seg.key]}</Text>
            <Text style={styles.legendText}>{seg.label}</Text>
          </View>
        ))}
      </View>
      <View style={styles.chipRow}>
        <Chip icon="repeat" color={colors.primary} text={`${review.dueCount} ta takrorlash kutyapti`} />
        <Chip icon="flash" color={colors.danger} text={`${review.weakCount} ta zaif so'z`} />
        <Chip icon="ribbon" color={colors.secondary} text={`${masteredPct}% o'zlashtirilgan`} />
      </View>
    </Card>
  );
}

function Chip({ icon, color, text }: { icon: keyof typeof Ionicons.glyphMap; color: string; text: string }) {
  return (
    <View style={[styles.chip, { backgroundColor: `${color}14` }]}>
      <Ionicons name={icon} size={13} color={color} />
      <Text style={[styles.chipText, { color }]}>{text}</Text>
    </View>
  );
}

function HardWordsCard({ words }: { words: Word[] }) {
  const hard = words
    .filter((w) => w.lapses > 0)
    .sort((a, b) => b.lapses - a.lapses)
    .slice(0, 5);
  if (hard.length === 0) return null;
  return (
    <Card style={styles.hardCard}>
      <Text style={styles.sectionTitleInline}>Eng qiyin so'zlar</Text>
      {hard.map((w, i) => (
        <View key={w.id} style={[styles.hardRow, i === hard.length - 1 && styles.hardRowLast]}>
          <View style={styles.hardRank}>
            <Text style={styles.hardRankText}>{i + 1}</Text>
          </View>
          <View style={styles.hardWords}>
            <Text style={styles.hardEnglish} numberOfLines={1}>{w.english}</Text>
            <Text style={styles.hardUzbek} numberOfLines={1}>{w.uzbek}</Text>
          </View>
          <View style={styles.hardMistakes}>
            <Ionicons name="close-circle" size={14} color={colors.danger} />
            <Text style={styles.hardMistakesText}>{w.lapses} marta xato</Text>
          </View>
        </View>
      ))}
    </Card>
  );
}

function ToggleButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.toggleBtn, active && styles.toggleBtnActive]} onPress={onPress}>
      <Text style={[styles.toggleText, active && styles.toggleTextActive]}>{label}</Text>
    </Pressable>
  );
}

function SummaryGrid({ summary }: { summary: StatsSummary }) {
  return (
    <View style={styles.summaryGrid}>
      <SummaryTile icon="flame" color="#F59E0B" value={summary.currentStreak} label="Ketma-ket kun" hint={`Eng yaxshi: ${summary.bestStreak}`} />
      <SummaryTile icon="calendar" color={colors.primary} value={summary.activeDays} label="Faol kunlar" />
      <SummaryTile icon="book" color={colors.primary} value={summary.totalWords} label="Jami so'z" />
      <SummaryTile icon="checkmark-done-circle" color={colors.secondary} value={`${summary.accuracyPercent}%`} label="Umumiy aniqlik" hint={`${summary.totalQuizzes} ta test`} />
    </View>
  );
}

const FORMAT_META = themed((): Record<string, { label: string; icon: keyof typeof Ionicons.glyphMap; color: string }> => ({
  TYPED: { label: 'Yozma test', icon: 'create-outline', color: colors.primary },
  CHOICE: { label: 'Variantli test', icon: 'list-outline', color: '#EC4899' },
  FLASHCARD: { label: 'Fleshkart', icon: 'layers-outline', color: '#F59E0B' },
  LISTENING: { label: 'Eshitib yozish', icon: 'headset-outline', color: '#14B8A6' },
  MATCHING: { label: 'Juftlarni moslash', icon: 'git-compare-outline', color: '#8B5CF6' },
  SPEED: { label: 'Tez raund', icon: 'timer-outline', color: '#EF4444' },
}));

function FormatBreakdown({ formats }: { formats: StatsSummary['formats'] }) {
  if (formats.every((f) => f.total === 0)) return null;
  return (
    <Card style={styles.formatCard}>
      <Text style={styles.formatTitle}>Javob turlari bo'yicha</Text>
      {formats.map((f) => {
        const meta = FORMAT_META[f.format];
        return (
          <View key={f.format} style={styles.formatRow}>
            <View style={styles.formatRowTop}>
              <Ionicons name={meta.icon} size={16} color={meta.color} />
              <Text style={styles.formatLabel}>{meta.label}</Text>
              <Text style={styles.formatValue}>
                {f.total > 0 ? `${f.accuracyPercent}% · ${f.correct}/${f.total}` : 'hali yo\'q'}
              </Text>
            </View>
            <View style={styles.formatTrack}>
              <View style={[styles.formatFill, { width: `${f.accuracyPercent}%`, backgroundColor: meta.color }]} />
            </View>
          </View>
        );
      })}
    </Card>
  );
}

function SummaryTile({
  icon,
  color,
  value,
  label,
  hint,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  value: number | string;
  label: string;
  hint?: string;
}) {
  return (
    <Card style={styles.tile}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={styles.tileValue}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
      {hint ? <Text style={styles.tileHint}>{hint}</Text> : null}
    </Card>
  );
}

function BarChart({ rows }: { rows: Row[] }) {
  const max = Math.max(1, ...rows.map((r) => r.correctAnswers + r.incorrectAnswers));
  return (
    <View style={styles.chart}>
      {rows.map((r) => {
        const total = r.correctAnswers + r.incorrectAnswers;
        const barHeight = (total / max) * CHART_HEIGHT;
        const correctHeight = total > 0 ? (r.correctAnswers / total) * barHeight : 0;
        return (
          <View key={r.key} style={styles.chartCol}>
            <Text style={styles.chartValue}>{total > 0 ? total : ''}</Text>
            <View style={[styles.chartTrack, { height: CHART_HEIGHT }]}>
              {total === 0 ? (
                <View style={styles.chartEmptyBar} />
              ) : (
                <View style={{ height: barHeight, borderRadius: 6, overflow: 'hidden' }}>
                  <View style={{ height: barHeight - correctHeight, backgroundColor: colors.danger }} />
                  <View style={{ height: correctHeight, backgroundColor: colors.secondary }} />
                </View>
              )}
            </View>
            <Text style={styles.chartLabel} numberOfLines={1}>
              {r.shortLabel}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

function PeriodCard({ row }: { row: Row }) {
  const answered = row.correctAnswers + row.incorrectAnswers;
  return (
    <Card style={styles.statCard}>
      <View style={styles.statHeader}>
        <Text style={styles.statDate}>{row.label}</Text>
        {answered > 0 && <Text style={styles.statAccuracy}>{row.accuracyPercent}%</Text>}
      </View>
      {answered > 0 && (
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${row.accuracyPercent}%` }]} />
        </View>
      )}
      <View style={styles.statRow}>
        <StatBlock label="Yangi so'z" value={row.wordsAdded} />
        <StatBlock label="Test" value={row.quizzesTaken} />
        <StatBlock label="To'g'ri" value={row.correctAnswers} color={colors.secondary} />
        <StatBlock label="Xato" value={row.incorrectAnswers} color={colors.danger} />
      </View>
    </Card>
  );
}

function StatBlock({ label, value, color = colors.primary }: { label: string; value: number | string; color?: string }) {
  return (
    <View style={styles.statBlock}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = themed(() => StyleSheet.create({
  todayCard: { marginBottom: 12 },
  todayTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  todayIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  todayText: { flex: 1 },
  todayTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  todaySub: { fontSize: 12.5, color: colors.textMuted, marginTop: 2 },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F59E0B1A', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6 },
  streakText: { fontSize: 14, fontWeight: '700', color: colors.amberText },
  todayNumbers: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 8 },
  todayDone: { fontSize: 28, fontWeight: '800' },
  todayGoal: { fontSize: 14, color: colors.textMuted, flex: 1 },
  todayPct: { fontSize: 15, fontWeight: '700' },

  stateCard: { marginBottom: 16 },
  stateHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitleInline: { fontSize: 14, fontWeight: '700', color: colors.text },
  stateTotal: { fontSize: 12, color: colors.textMuted },
  stateBar: { flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden', backgroundColor: colors.border, marginBottom: 12 },
  stateLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 12 },
  stateLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  stateLegendValue: { fontSize: 13, fontWeight: '700', color: colors.text },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 },
  chipText: { fontSize: 12, fontWeight: '600' },

  hardCard: { marginBottom: 16 },
  hardRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  hardRowLast: { borderBottomWidth: 0, paddingBottom: 0 },
  hardRank: { width: 26, height: 26, borderRadius: 13, backgroundColor: `${colors.danger}14`, alignItems: 'center', justifyContent: 'center' },
  hardRankText: { fontSize: 12, fontWeight: '700', color: colors.danger },
  hardWords: { flex: 1 },
  hardEnglish: { fontSize: 14.5, fontWeight: '600', color: colors.text },
  hardUzbek: { fontSize: 12.5, color: colors.textMuted, marginTop: 1 },
  hardMistakes: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  hardMistakesText: { fontSize: 12, color: colors.textMuted },

  formatCard: { marginTop: 8, marginBottom: 12 },
  formatTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 12 },
  formatRow: { marginBottom: 12 },
  formatRowTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  formatLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text },
  formatValue: { fontSize: 13, color: colors.textMuted },
  formatTrack: { height: 6, borderRadius: 3, backgroundColor: colors.border, overflow: 'hidden' },
  formatFill: { height: 6, borderRadius: 3 },
  toggleRow: { flexDirection: 'row', backgroundColor: colors.border, borderRadius: 12, padding: 4, marginBottom: 20 },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: 'center' },
  toggleBtnActive: { backgroundColor: colors.surface },
  toggleText: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  toggleTextActive: { color: colors.text },
  loader: { marginTop: 40 },
  centered: { alignItems: 'center' },
  emptyText: { textAlign: 'center', color: colors.textMuted, marginTop: 24 },
  retryBtn: { marginTop: 12, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10, borderWidth: 1.5, borderColor: colors.primary },
  retryText: { color: colors.primary, fontWeight: '600' },

  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 4 },
  tile: { width: '48.5%', marginBottom: 12, alignItems: 'flex-start' },
  tileValue: { fontSize: 24, fontWeight: '800', color: colors.text, marginTop: 6 },
  tileLabel: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  tileHint: { fontSize: 11, color: colors.textMuted, marginTop: 2 },

  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 12 },
  chartCard: { marginBottom: 16 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around' },
  chartCol: { flex: 1, alignItems: 'center' },
  chartTrack: { width: '55%', justifyContent: 'flex-end' },
  chartEmptyBar: { height: 3, borderRadius: 2, backgroundColor: colors.border },
  chartValue: { fontSize: 11, color: colors.textMuted, marginBottom: 4, height: 14 },
  chartLabel: { fontSize: 11, color: colors.textMuted, marginTop: 6 },
  legend: { flexDirection: 'row', justifyContent: 'center', marginTop: 12, gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: colors.textMuted },

  statCard: { marginBottom: 12 },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  statDate: { fontSize: 14, fontWeight: '700', color: colors.text },
  statAccuracy: { fontSize: 14, fontWeight: '700', color: colors.secondary },
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: colors.border, overflow: 'hidden', marginBottom: 12 },
  progressFill: { height: 6, borderRadius: 3, backgroundColor: colors.secondary },
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBlock: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 18, fontWeight: '700' },
  statLabel: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
}));
