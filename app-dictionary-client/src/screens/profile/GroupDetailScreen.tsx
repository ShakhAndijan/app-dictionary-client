import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { ProfileStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import Button from '../../components/Button';
import AlertModal, { AlertContent } from '../../components/AlertModal';
import { colors, themed } from '../../theme/colors';
import * as groupsApi from '../../api/groupsApi';
import { GroupDetail, GroupMember } from '../../api/groupsApi';
import { extractErrorMessage } from '../../utils/errors';

type Props = NativeStackScreenProps<ProfileStackParamList, 'GroupDetail'>;
type Period = 'week' | 'all';

const MEDALS = ['🥇', '🥈', '🥉'];

function xpOf(m: GroupMember, period: Period) {
  return period === 'week' ? m.weekXp : m.totalXp;
}

export default function GroupDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [error, setError] = useState(false);
  const [period, setPeriod] = useState<Period>('week');
  const [alert, setAlert] = useState<AlertContent | null>(null);

  const load = useCallback(() => {
    setError(false);
    groupsApi
      .getGroup(id)
      .then(setGroup)
      .catch(() => setError(true));
  }, [id]);

  useFocusEffect(load);

  const fail = (e: any) =>
    setAlert({ variant: 'error', title: 'Xatolik', message: extractErrorMessage(e, "Amalni bajarib bo'lmadi") });

  const share = () => {
    if (!group) return;
    Share.share({
      message: `"${group.name}" guruhimizga qo'shiling! Lug'at ilovasida Profil → Guruhlar → Kod bilan qo'shilish, kod: ${group.inviteCode}`,
    }).catch(() => undefined);
  };

  const leave = () =>
    setAlert({
      variant: 'warning',
      title: 'Guruhdan chiqish',
      message: group?.members.length === 1 ? "Siz oxirgi a'zosiz, guruh o'chib ketadi." : 'Guruhdan chiqmoqchimisiz?',
      confirmText: 'Chiqish',
      cancelText: 'Bekor qilish',
      onConfirm: () => {
        groupsApi
          .leaveGroup(id)
          .then(() => navigation.goBack())
          .catch(fail);
      },
    });

  const removeGroup = () =>
    setAlert({
      variant: 'warning',
      title: "Guruhni o'chirish",
      message: "Guruh va uning reytingi hamma uchun o'chadi.",
      confirmText: "O'chirish",
      cancelText: 'Bekor qilish',
      onConfirm: () => {
        groupsApi
          .deleteGroup(id)
          .then(() => navigation.goBack())
          .catch(fail);
      },
    });

  const kick = (m: GroupMember) =>
    setAlert({
      variant: 'warning',
      title: "A'zoni chiqarish",
      message: `${m.name} guruhdan chiqarilsinmi?`,
      confirmText: 'Chiqarish',
      cancelText: 'Bekor qilish',
      onConfirm: () => {
        groupsApi
          .removeGroupMember(id, m.userId)
          .then(load)
          .catch(fail);
      },
    });

  if (!group) {
    return (
      <ScreenContainer>
        {error ? (
          <Text style={styles.muted}>Guruhni yuklab bo'lmadi</Text>
        ) : (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        )}
      </ScreenContainer>
    );
  }

  const ranked = [...group.members].sort(
    (a, b) => xpOf(b, period) - xpOf(a, period) || b.totalXp - a.totalXp || a.name.localeCompare(b.name)
  );
  const top = Math.max(1, ...ranked.map((m) => xpOf(m, period)));

  return (
    <ScreenContainer>
      <View style={styles.head}>
        <Text style={styles.headEmoji}>{group.emoji}</Text>
        <Text style={styles.headName}>{group.name}</Text>
        <Text style={styles.headMeta}>{group.members.length} a'zo</Text>
      </View>

      <Card style={styles.codeCard}>
        <View>
          <Text style={styles.codeLabel}>Taklif kodi</Text>
          <Text style={styles.code} selectable>
            {group.inviteCode}
          </Text>
        </View>
        <Pressable style={styles.shareBtn} onPress={share}>
          <Ionicons name="share-social-outline" size={18} color="#fff" />
          <Text style={styles.shareText}>Yuborish</Text>
        </Pressable>
      </Card>

      <View style={styles.tabs}>
        {(['week', 'all'] as Period[]).map((p) => (
          <Pressable key={p} style={[styles.tab, period === p && styles.tabOn]} onPress={() => setPeriod(p)}>
            <Text style={[styles.tabText, period === p && styles.tabTextOn]}>
              {p === 'week' ? 'Shu hafta' : 'Hammasi'}
            </Text>
          </Pressable>
        ))}
      </View>

      {ranked.map((m, i) => {
        const xp = xpOf(m, period);
        return (
          <Card key={m.userId} style={m.me ? { ...styles.row, ...styles.rowMe } : styles.row}>
            <Text style={styles.rank}>{i < 3 && xp > 0 ? MEDALS[i] : `${i + 1}`}</Text>
            <View style={styles.rowBody}>
              <View style={styles.nameLine}>
                <Text style={styles.name} numberOfLines={1}>
                  {m.name}
                  {m.me ? ' (siz)' : ''}
                </Text>
                {m.owner && <Ionicons name="shield-checkmark" size={14} color={colors.primary} />}
              </View>
              <Text style={styles.sub}>
                @{m.username} · {m.level}-daraja · {m.levelTitle}
              </Text>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${Math.round((xp / top) * 100)}%` }]} />
              </View>
            </View>
            <Text style={styles.xp}>{xp}</Text>
            <Text style={styles.xpUnit}>XP</Text>
            {group.ownedByMe && !m.me && (
              <Pressable hitSlop={8} onPress={() => kick(m)} style={styles.kick}>
                <Ionicons name="close-circle-outline" size={20} color={colors.textMuted} />
              </Pressable>
            )}
          </Card>
        );
      })}
      <Text style={styles.hint}>Haftalik reyting dushanba kuni yangilanadi.</Text>

      <Button title="Guruhdan chiqish" variant="outline" onPress={leave} style={styles.footBtn} />
      {group.ownedByMe && <Button title="Guruhni o'chirish" variant="danger" onPress={removeGroup} style={styles.footBtn} />}

      <AlertModal alert={alert} onClose={() => setAlert(null)} />
    </ScreenContainer>
  );
}

const styles = themed(() => StyleSheet.create({
  muted: { color: colors.textMuted, textAlign: 'center', marginTop: 30 },
  loader: { marginTop: 30 },
  head: { alignItems: 'center', marginBottom: 14 },
  headEmoji: { fontSize: 44 },
  headName: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 4 },
  headMeta: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  codeCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  codeLabel: { fontSize: 12, color: colors.textMuted },
  code: { fontSize: 26, fontWeight: '800', letterSpacing: 4, color: colors.primary, marginTop: 2 },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  shareText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  tabs: { flexDirection: 'row', backgroundColor: colors.border, borderRadius: 12, padding: 3, marginBottom: 12 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  tabOn: { backgroundColor: colors.surface },
  tabText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  tabTextOn: { color: colors.text, fontWeight: '800' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8, padding: 12 },
  rowMe: { borderWidth: 2, borderColor: `${colors.primary}55` },
  rank: { width: 30, fontSize: 20, fontWeight: '800', textAlign: 'center', color: colors.textMuted },
  rowBody: { flex: 1 },
  nameLine: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  name: { fontSize: 15, fontWeight: '700', color: colors.text, flexShrink: 1 },
  sub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  track: { height: 5, borderRadius: 3, backgroundColor: colors.border, marginTop: 6, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3, backgroundColor: colors.primary },
  xp: { fontSize: 18, fontWeight: '800', color: colors.text },
  xpUnit: { fontSize: 10, fontWeight: '700', color: colors.textMuted, marginLeft: -6, marginTop: 6 },
  kick: { marginLeft: 2 },
  hint: { fontSize: 11, color: colors.textMuted, textAlign: 'center', marginTop: 6 },
  footBtn: { marginTop: 14 },
}));
