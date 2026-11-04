import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { AdminStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import Button from '../../components/Button';
import AlertModal, { AlertContent } from '../../components/AlertModal';
import { colors, themed } from '../../theme/colors';
import * as adminApi from '../../api/adminApi';
import { extractErrorMessage } from '../../utils/errors';
import { ago, day, FORMAT_LABEL, nf } from './format';

type Props = NativeStackScreenProps<AdminStackParamList, 'AdminUser'>;
type Tab = 'words' | 'history' | 'week' | 'ach';

const TABS: [Tab, string][] = [
  ['words', "So'zlar"],
  ['history', 'Tarix'],
  ['week', 'Hafta'],
  ['ach', 'Yutuqlar'],
];

export default function AdminUserScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [d, setD] = useState<adminApi.AdminUserDetail | null>(null);
  const [failed, setFailed] = useState(false);
  const [tab, setTab] = useState<Tab>('words');
  const [busy, setBusy] = useState(false);
  const [alert, setAlert] = useState<AlertContent | null>(null);

  const load = useCallback(() => {
    setFailed(false);
    adminApi.userDetail(id).then(setD).catch(() => setFailed(true));
  }, [id]);
  useFocusEffect(load);

  if (!d) {
    return (
      <ScreenContainer>
        {failed ? <Text style={styles.muted}>Yuklab bo'lmadi</Text> : <ActivityIndicator color={colors.primary} style={{ marginTop: 30 }} />}
      </ScreenContainer>
    );
  }

  const u = d.user;
  const isAdmin = u.role === 'ADMIN';
  const pct = u.reviewCount ? Math.round((u.correctCount / u.reviewCount) * 100) : null;
  const weekMax = Math.max(1, ...d.weekly.days.map((x) => x.answers));

  const fail = (e: unknown) =>
    setAlert({ variant: 'error', title: 'Xatolik', message: extractErrorMessage(e, "Amalni bajarib bo'lmadi") });

  const run = (job: () => Promise<unknown>) => {
    setBusy(true);
    job().catch(fail).finally(() => setBusy(false));
  };

  const toggleBlock = () =>
    setAlert({
      variant: 'warning',
      title: u.blocked ? 'Blokdan chiqarilsinmi?' : 'Bloklansinmi?',
      message: u.blocked
        ? `@${u.username} yana tizimga kira oladi.`
        : `@${u.username} barcha qurilmalardan chiqariladi va qayta kira olmaydi.`,
      confirmText: u.blocked ? 'Blokdan chiqarish' : 'Bloklash',
      cancelText: 'Bekor qilish',
      onConfirm: () => run(() => adminApi.setBlocked(u.id, !u.blocked).then((row) => setD({ ...d, user: row }))),
    });

  const toggleRole = () =>
    setAlert({
      variant: 'warning',
      title: isAdmin ? 'Adminlik olib tashlansinmi?' : 'Admin qilinsinmi?',
      message: isAdmin
        ? `@${u.username} admin panelga kira olmaydi.`
        : `@${u.username} admin panelga to'liq kirish huquqini oladi.`,
      confirmText: isAdmin ? 'Olib tashlash' : 'Admin qilish',
      cancelText: 'Bekor qilish',
      onConfirm: () => run(() => adminApi.setRole(u.id, isAdmin ? 'USER' : 'ADMIN').then((row) => setD({ ...d, user: row }))),
    });

  const remove = () =>
    setAlert({
      variant: 'warning',
      title: "Butunlay o'chirilsinmi?",
      message: `@${u.username} va uning barcha ma'lumotlari (so'zlar, javoblar, XP, yutuqlar, guruhlar) o'chadi. Buni qaytarib bo'lmaydi. Vaqtincha to'xtatish uchun bloklang.`,
      confirmText: "O'chirish",
      cancelText: 'Bekor qilish',
      onConfirm: () => run(() => adminApi.deleteUser(u.id).then(() => navigation.goBack())),
    });

  return (
    <ScreenContainer>
      <View style={styles.head}>
        <Text style={styles.name}>{u.fullName || u.username}</Text>
        <Text style={styles.sub}>@{u.username} · {u.email}</Text>
        <View style={styles.chips}>
          {isAdmin && <Text style={[styles.chip, styles.chipAdmin]}>Admin</Text>}
          {u.blocked && <Text style={[styles.chip, styles.chipBlocked]}>Bloklangan</Text>}
        </View>
        <Text style={styles.sub}>
          Ro'yxatdan: {day(u.createdAt)} · kirish: {ago(u.lastLoginAt)} · mashq: {ago(u.lastActiveAt)}
        </Text>
      </View>

      <View style={styles.grid}>
        <Stat label="Daraja" value={`${d.level}`} hint={d.levelTitle} />
        <Stat label="XP" value={nf(u.totalXp)} />
        <Stat label="So'zlar" value={`${u.wordCount}`} />
        <Stat label="Javoblar" value={nf(u.reviewCount)} hint={pct === null ? undefined : `${pct}% to'g'ri`} />
        <Stat label="Yutuqlar" value={`${d.achievements.length}/${d.totalAchievements}`} />
      </View>

      <View style={styles.actions}>
        {!isAdmin && <Button title={u.blocked ? 'Blokdan chiqarish' : 'Bloklash'} variant="outline" onPress={toggleBlock} loading={busy} style={styles.actionBtn} />}
        <Button title={isAdmin ? 'Adminlikni olib tashlash' : 'Admin qilish'} variant="outline" onPress={toggleRole} loading={busy} style={styles.actionBtn} />
        {!isAdmin && <Button title="Foydalanuvchini o'chirish" variant="danger" onPress={remove} loading={busy} style={styles.actionBtn} />}
      </View>

      <View style={styles.tabs}>
        {TABS.map(([k, label]) => (
          <Pressable key={k} onPress={() => setTab(k)} style={[styles.tab, tab === k && styles.tabOn]}>
            <Text style={[styles.tabText, tab === k && styles.tabTextOn]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <Card>
        {tab === 'words' &&
          (d.words.length === 0 ? (
            <Text style={styles.muted}>So'z qo'shilmagan.</Text>
          ) : (
            d.words.map((w) => (
              <View key={w.id} style={styles.line}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.lineTitle}>{w.english}{w.weak ? '  ⚠' : ''}</Text>
                  <Text style={styles.sub}>{w.uzbek}</Text>
                </View>
                <Text style={styles.sub}>{w.lapses} xato</Text>
              </View>
            ))
          ))}

        {tab === 'history' &&
          (d.recentReviews.length === 0 ? (
            <Text style={styles.muted}>Hali mashq qilinmagan.</Text>
          ) : (
            d.recentReviews.map((r, i) => (
              <View key={i} style={styles.line}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.lineTitle}>{r.english}</Text>
                  <Text style={styles.sub}>{FORMAT_LABEL[r.format] ?? r.format} · {ago(r.answeredAt)}</Text>
                </View>
                <Text style={{ color: r.correct ? colors.secondary : colors.danger, fontWeight: '800' }}>{r.correct ? "✓ To'g'ri" : '✗ Xato'}</Text>
              </View>
            ))
          ))}

        {tab === 'week' && (
          <>
            <Text style={styles.sub}>{day(d.weekly.weekStart)} – {day(d.weekly.weekEnd)}</Text>
            <View style={styles.chart}>
              {d.weekly.days.map((x) => (
                <View key={x.date} style={styles.col}>
                  <View style={styles.bars}>
                    <View style={[styles.bar, { height: `${(x.answers / weekMax) * 100}%`, backgroundColor: colors.primary }]} />
                    <View style={[styles.bar, { height: `${(x.correct / weekMax) * 100}%`, backgroundColor: colors.secondary }]} />
                  </View>
                  <Text style={styles.sub}>{['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'][new Date(x.date).getDay()]}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.sub}><Text style={{ color: colors.primary }}>●</Text> Javoblar   <Text style={{ color: colors.secondary }}>●</Text> To'g'ri</Text>
          </>
        )}

        {tab === 'ach' &&
          (d.achievements.length === 0 ? (
            <Text style={styles.muted}>Hali yutuq yo'q.</Text>
          ) : (
            d.achievements.map((a) => (
              <View key={a.code} style={styles.line}>
                <Text style={{ fontSize: 24 }}>{a.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.lineTitle}>{a.title}</Text>
                  <Text style={styles.sub}>{a.description} · {day(a.unlockedAt)}</Text>
                </View>
              </View>
            ))
          ))}
      </Card>

      <AlertModal alert={alert} onClose={() => setAlert(null)} />
    </ScreenContainer>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {!!hint && <Text style={styles.sub}>{hint}</Text>}
    </View>
  );
}

const styles = themed(() => StyleSheet.create({
  muted: { color: colors.textMuted, textAlign: 'center', padding: 14 },
  head: { marginBottom: 14 },
  name: { fontSize: 24, fontWeight: '800', color: colors.text },
  sub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  chips: { flexDirection: 'row', gap: 6, marginTop: 6 },
  chip: { fontSize: 11, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99, overflow: 'hidden' },
  chipAdmin: { color: colors.indigoText, backgroundColor: colors.indigoBg },
  chipBlocked: { color: colors.danger, backgroundColor: '#EF444422' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  stat: { width: '48%', flexGrow: 1, backgroundColor: colors.surface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.border },
  statLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '700' },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 2 },
  actions: { gap: 8, marginBottom: 14 },
  actionBtn: { marginTop: 0 },
  tabs: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  tabOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  tabTextOn: { color: '#fff' },
  line: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  lineTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 8, marginVertical: 12 },
  col: { flex: 1, height: '100%', justifyContent: 'flex-end', alignItems: 'center' },
  bars: { flex: 1, width: '100%', flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  bar: { flex: 1, borderRadius: 3, minHeight: 2 },
}));
