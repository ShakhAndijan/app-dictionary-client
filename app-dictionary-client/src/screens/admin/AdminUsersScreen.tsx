import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { AdminStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import { colors, themed } from '../../theme/colors';
import * as adminApi from '../../api/adminApi';
import { ago } from './format';

type Props = NativeStackScreenProps<AdminStackParamList, 'AdminUsers'>;

export default function AdminUsersScreen({ navigation }: Props) {
  const [users, setUsers] = useState<adminApi.AdminUser[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState('');

  const load = useCallback(() => {
    setFailed(false);
    adminApi.users().then(setUsers).catch(() => setFailed(true));
  }, []);
  useFocusEffect(load);

  const rows = useMemo(() => {
    if (!users) return [];
    const q = query.trim().toLowerCase();
    const list = q ? users.filter((u) => `${u.username} ${u.fullName} ${u.email}`.toLowerCase().includes(q)) : [...users];
    const t = (u: adminApi.AdminUser) => new Date(u.lastActiveAt ?? u.lastLoginAt ?? 0).getTime();
    return list.sort((a, b) => t(b) - t(a));
  }, [users, query]);

  return (
    <ScreenContainer>
      <TextInput
        style={styles.search}
        placeholder="Ism, login yoki email..."
        placeholderTextColor={colors.textMuted}
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {!users ? (
        failed ? <Text style={styles.muted}>Yuklab bo'lmadi</Text> : <ActivityIndicator color={colors.primary} style={{ marginTop: 30 }} />
      ) : rows.length === 0 ? (
        <Text style={styles.muted}>Hech kim topilmadi.</Text>
      ) : (
        rows.map((u) => {
          const pct = u.reviewCount ? Math.round((u.correctCount / u.reviewCount) * 100) : null;
          return (
            <Pressable key={u.id} onPress={() => navigation.navigate('AdminUser', { id: u.id, name: u.fullName || u.username })}>
              <Card style={u.blocked ? { ...styles.card, opacity: 0.55 } : styles.card}>
                <View style={styles.ava}><Text style={styles.avaText}>{(u.fullName || u.username).slice(0, 1).toUpperCase()}</Text></View>
                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name} numberOfLines={1}>{u.fullName || u.username}</Text>
                    {u.role === 'ADMIN' && <Text style={[styles.chip, styles.chipAdmin]}>Admin</Text>}
                    {u.blocked && <Text style={[styles.chip, styles.chipBlocked]}>Bloklangan</Text>}
                  </View>
                  <Text style={styles.sub} numberOfLines={1}>@{u.username} · {u.email}</Text>
                  <Text style={styles.sub}>
                    {u.wordCount} so'z · {u.reviewCount} javob{pct === null ? '' : ` · ${pct}%`} · {ago(u.lastActiveAt ?? u.lastLoginAt)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </Card>
            </Pressable>
          );
        })
      )}
    </ScreenContainer>
  );
}

const styles = themed(() => StyleSheet.create({
  search: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, color: colors.text, marginBottom: 14 },
  muted: { color: colors.textMuted, textAlign: 'center', marginTop: 30 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  ava: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.indigoBg, alignItems: 'center', justifyContent: 'center' },
  avaText: { color: colors.indigoText, fontWeight: '800', fontSize: 16 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: 15, fontWeight: '700', color: colors.text, flexShrink: 1 },
  sub: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  chip: { fontSize: 10, fontWeight: '800', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 99, overflow: 'hidden' },
  chipAdmin: { color: colors.indigoText, backgroundColor: colors.indigoBg },
  chipBlocked: { color: colors.danger, backgroundColor: '#EF444422' },
}));
