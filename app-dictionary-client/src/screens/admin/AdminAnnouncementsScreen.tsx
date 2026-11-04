import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import Button from '../../components/Button';
import AlertModal, { AlertContent } from '../../components/AlertModal';
import { colors, themed } from '../../theme/colors';
import * as adminApi from '../../api/adminApi';
import { extractErrorMessage } from '../../utils/errors';
import { ago } from './format';

const SEVERITIES: [adminApi.Severity, string][] = [
  ['INFO', "Ma'lumot"],
  ['WARNING', 'Ogohlantirish'],
  ['CRITICAL', 'Muhim'],
];

export default function AdminAnnouncementsScreen() {
  const [list, setList] = useState<adminApi.Announcement[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<adminApi.Severity>('INFO');
  const [busy, setBusy] = useState(false);
  const [alert, setAlert] = useState<AlertContent | null>(null);

  const load = useCallback(() => {
    setFailed(false);
    adminApi.announcements().then(setList).catch(() => setFailed(true));
  }, []);
  useFocusEffect(load);

  const fail = (e: unknown) =>
    setAlert({ variant: 'error', title: 'Xatolik', message: extractErrorMessage(e, "Amalni bajarib bo'lmadi") });

  const send = () => {
    setBusy(true);
    adminApi
      .announce(message.trim(), severity)
      .then((a) => {
        setList((l) => [a, ...(l ?? [])]);
        setMessage('');
      })
      .catch(fail)
      .finally(() => setBusy(false));
  };

  const remove = (a: adminApi.Announcement) =>
    setAlert({
      variant: 'warning',
      title: "E'lon o'chirilsinmi?",
      message: "Foydalanuvchilar uni endi ko'rmaydi.",
      confirmText: "O'chirish",
      cancelText: 'Bekor qilish',
      onConfirm: () =>
        adminApi
          .deleteAnnouncement(a.id)
          .then(() => setList((l) => (l ?? []).filter((x) => x.id !== a.id)))
          .catch(fail),
    });

  return (
    <ScreenContainer>
      <Card style={{ marginBottom: 14 }}>
        <Text style={styles.title}>Yangi e'lon</Text>
        <TextInput
          style={styles.input}
          multiline
          maxLength={500}
          placeholder="Masalan: Bugun 22:00 da texnik ishlar bo'ladi."
          placeholderTextColor={colors.textMuted}
          value={message}
          onChangeText={setMessage}
        />
        <View style={styles.sev}>
          {SEVERITIES.map(([k, label]) => (
            <Pressable key={k} onPress={() => setSeverity(k)} style={[styles.sevBtn, severity === k && styles.sevOn]}>
              <Text style={[styles.sevText, severity === k && styles.sevTextOn]}>{label}</Text>
            </Pressable>
          ))}
        </View>
        <Button title="Hammaga yuborish" onPress={send} loading={busy} disabled={!message.trim()} style={{ marginTop: 12 }} />
      </Card>

      <Text style={styles.title}>Hozirgi e'lonlar</Text>
      {!list ? (
        failed ? <Text style={styles.muted}>Yuklab bo'lmadi</Text> : <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />
      ) : list.length === 0 ? (
        <Text style={styles.muted}>E'lon yo'q.</Text>
      ) : (
        list.map((a) => (
          <Card key={a.id} style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.msg}>{a.message}</Text>
              <Text style={styles.sub}>{a.severity} · @{a.createdBy} · {ago(a.createdAt)}</Text>
            </View>
            <Pressable hitSlop={10} onPress={() => remove(a)}>
              <Ionicons name="trash-outline" size={20} color={colors.danger} />
            </Pressable>
          </Card>
        ))
      )}

      <AlertModal alert={alert} onClose={() => setAlert(null)} />
    </ScreenContainer>
  );
}

const styles = themed(() => StyleSheet.create({
  title: { fontSize: 14, fontWeight: '800', color: colors.text, marginBottom: 10 },
  muted: { color: colors.textMuted, textAlign: 'center', marginTop: 20 },
  input: { minHeight: 90, textAlignVertical: 'top', borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, color: colors.text, backgroundColor: colors.background },
  sev: { flexDirection: 'row', gap: 6, marginTop: 10 },
  sevBtn: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: colors.border },
  sevOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  sevText: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  sevTextOn: { color: '#fff' },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  msg: { fontSize: 14, color: colors.text, fontWeight: '600' },
  sub: { fontSize: 12, color: colors.textMuted, marginTop: 3 },
}));
