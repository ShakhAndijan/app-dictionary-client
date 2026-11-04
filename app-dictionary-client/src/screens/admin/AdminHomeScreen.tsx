import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { AdminStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import { colors, themed } from '../../theme/colors';
import * as adminApi from '../../api/adminApi';
import { FORMAT_LABEL, nf } from './format';

type Props = NativeStackScreenProps<AdminStackParamList, 'AdminHome'>;

const PERIODS = [7, 14, 30, 90];

export default function AdminHomeScreen({ navigation }: Props) {
  const [days, setDays] = useState(14);
  const [o, setO] = useState<adminApi.AdminOverview | null>(null);
  const [ins, setIns] = useState<adminApi.AdminInsights | null>(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(() => {
    setFailed(false);
    adminApi.overview(days).then(setO).catch(() => setFailed(true));
    adminApi.insights(days).then(setIns).catch(() => setIns(null));
  }, [days]);

  useFocusEffect(load);

  const menu: { icon: keyof typeof Ionicons.glyphMap; label: string; to: 'AdminUsers' | 'AdminAnnouncements' | 'AdminAudit' }[] = [
    { icon: 'people', label: 'Foydalanuvchilar', to: 'AdminUsers' },
    { icon: 'megaphone', label: "E'lonlar", to: 'AdminAnnouncements' },
    { icon: 'document-text', label: 'Jurnal', to: 'AdminAudit' },
  ];

  const max = o ? Math.max(1, ...o.series.map((p) => Math.max(p.newUsers, p.activeUsers))) : 1;
  const fmtTop = ins ? Math.max(1, ...ins.formats.map((f) => f.answers)) : 1;
  const hardTop = ins ? Math.max(1, ...ins.hardestWords.map((w) => w.answers)) : 1;

  return (
    <ScreenContainer>
      <View style={styles.menu}>
        {menu.map((m) => (
          <Pressable key={m.to} style={styles.menuItem} onPress={() => navigation.navigate(m.to)}>
            <Ionicons name={m.icon} size={22} color={colors.primary} />
            <Text style={styles.menuText}>{m.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.periods}>
        {PERIODS.map((n) => (
          <Pressable key={n} onPress={() => setDays(n)} style={[styles.period, n === days && styles.periodOn]}>
            <Text style={[styles.periodText, n === days && styles.periodTextOn]}>{n} kun</Text>
          </Pressable>
        ))}
      </View>

      {!o ? (
        failed ? <Text style={styles.muted}>Yuklab bo'lmadi. Internetni tekshiring.</Text> : <ActivityIndicator color={colors.primary} style={{ marginTop: 30 }} />
      ) : (
        <>
          <View style={styles.hero}>
            <Text style={styles.heroLabel}>Jami foydalanuvchilar</Text>
            <Text style={styles.heroValue}>{nf(o.totalUsers)}</Text>
            <Text style={styles.heroSub}>
              Bugun +{o.newToday} · haftada +{o.newLast7Days} · oyda +{o.newLast30Days}
            </Text>
            <View style={styles.heroRow}>
              <View><Text style={styles.heroNum}>{o.activeToday}</Text><Text style={styles.heroCap}>bugun faol</Text></View>
              <View><Text style={styles.heroNum}>{o.activeLast7Days}</Text><Text style={styles.heroCap}>7 kunda</Text></View>
              <View><Text style={styles.heroNum}>{o.activeLast30Days}</Text><Text style={styles.heroCap}>30 kunda</Text></View>
            </View>
          </View>

          <View style={styles.grid}>
            <Stat label="So'zlar" value={nf(o.totalWords)} />
            <Stat label="Javoblar" value={nf(o.totalReviews)} />
            <Stat label="Aniqlik" value={`${o.accuracyPercent}%`} />
            <Stat label="Testlar" value={nf(o.totalQuizSessions)} />
          </View>

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>So'nggi {days} kun: faol va yangi</Text>
            <View style={styles.chart}>
              {o.series.map((p) => (
                <View key={p.date} style={styles.col}>
                  <View style={styles.bars}>
                    <View style={[styles.bar, { height: `${(p.activeUsers / max) * 100}%`, backgroundColor: colors.primary }]} />
                    <View style={[styles.bar, { height: `${(p.newUsers / max) * 100}%`, backgroundColor: colors.secondary }]} />
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.legend}>
              <Text style={styles.legendText}><Text style={{ color: colors.primary }}>●</Text> Faol   <Text style={{ color: colors.secondary }}>●</Text> Yangi</Text>
            </View>
          </Card>

          {ins && (
            <>
              <Card style={styles.card}>
                <Text style={styles.cardTitle}>Mashq turlari</Text>
                {ins.formats.length === 0 ? (
                  <Text style={styles.muted}>Bu davrda javob yo'q.</Text>
                ) : (
                  [...ins.formats].sort((a, b) => b.answers - a.answers).map((f) => (
                    <Row key={f.format} label={FORMAT_LABEL[f.format] ?? f.format} width={f.answers / fmtTop}
                      value={`${nf(f.answers)} · ${f.answers ? Math.round((f.correct / f.answers) * 100) : 0}%`} />
                  ))
                )}
              </Card>

              <Card style={styles.card}>
                <Text style={styles.cardTitle}>Ushlab qolish (retention)</Text>
                <View style={styles.retRow}>
                  {ins.retention.map((r) => (
                    <View key={r.days} style={styles.ret}>
                      <Text style={styles.retPct}>{r.cohort ? `${Math.round((r.retained / r.cohort) * 100)}%` : '—'}</Text>
                      <Text style={styles.retLabel}>{r.days} kun</Text>
                      <Text style={styles.retSub}>{r.retained}/{r.cohort}</Text>
                    </View>
                  ))}
                </View>
              </Card>

              <Card style={styles.card}>
                <Text style={styles.cardTitle}>Eng qiyin so'zlar</Text>
                {ins.hardestWords.length === 0 ? (
                  <Text style={styles.muted}>Hali yetarli ma'lumot yo'q.</Text>
                ) : (
                  ins.hardestWords.map((w) => (
                    <Row key={w.english} label={w.english} danger width={w.answers / hardTop}
                      value={`${Math.round((w.wrong / w.answers) * 100)}% xato`} />
                  ))
                )}
              </Card>
            </>
          )}
        </>
      )}
    </ScreenContainer>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function Row({ label, value, width, danger }: { label: string; value: string; width: number; danger?: boolean }) {
  return (
    <View style={styles.hrow}>
      <Text style={styles.hlabel} numberOfLines={1}>{label}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.max(4, width * 100)}%`, backgroundColor: danger ? colors.danger : colors.primary }]} />
      </View>
      <Text style={styles.hvalue}>{value}</Text>
    </View>
  );
}

const styles = themed(() => StyleSheet.create({
  muted: { color: colors.textMuted, textAlign: 'center', marginTop: 12 },
  menu: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  menuItem: { flex: 1, alignItems: 'center', gap: 6, paddingVertical: 14, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  menuText: { fontSize: 12, fontWeight: '700', color: colors.text },
  periods: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  period: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  periodOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  periodText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  periodTextOn: { color: '#fff' },
  hero: { backgroundColor: '#4F46E5', borderRadius: 22, padding: 20, marginBottom: 12 },
  heroLabel: { color: '#C7D2FE', fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  heroValue: { color: '#fff', fontSize: 48, fontWeight: '800', marginTop: 4 },
  heroSub: { color: '#E0E7FF', fontSize: 13, marginTop: 2 },
  heroRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  heroNum: { color: '#fff', fontSize: 22, fontWeight: '800' },
  heroCap: { color: '#C7D2FE', fontSize: 11 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  stat: { width: '48%', flexGrow: 1, backgroundColor: colors.surface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.border },
  statLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '700' },
  statValue: { fontSize: 24, fontWeight: '800', color: colors.text, marginTop: 2 },
  card: { marginBottom: 12 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: colors.text, marginBottom: 10 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: 110, gap: 2 },
  col: { flex: 1, height: '100%', justifyContent: 'flex-end' },
  bars: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 1 },
  bar: { flex: 1, borderRadius: 2, minHeight: 2 },
  legend: { marginTop: 8 },
  legendText: { fontSize: 12, color: colors.textMuted },
  hrow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  hlabel: { width: 84, fontSize: 13, fontWeight: '700', color: colors.text },
  track: { flex: 1, height: 8, borderRadius: 99, backgroundColor: colors.border, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 99 },
  hvalue: { fontSize: 12, color: colors.textMuted, minWidth: 70, textAlign: 'right' },
  retRow: { flexDirection: 'row', gap: 10 },
  ret: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 14, backgroundColor: colors.background },
  retPct: { fontSize: 22, fontWeight: '800', color: colors.text },
  retLabel: { fontSize: 12, fontWeight: '700', color: colors.text },
  retSub: { fontSize: 11, color: colors.textMuted },
}));
