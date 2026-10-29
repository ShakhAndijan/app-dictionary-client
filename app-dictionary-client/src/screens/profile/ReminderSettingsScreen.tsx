import React, { useCallback, useState } from 'react';
import { Alert, AppState, Linking, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { extractErrorMessage } from '../../utils/errors';
import {
  DEFAULT_REMINDER_SETTINGS,
  ReminderSettings,
  getReminderPermission,
  loadReminderSettings,
  requestReminderPermission,
  saveReminderSettings,
  sendTestReminder,
  syncReminders,
} from '../../services/reminders';

const GOAL_OPTIONS = [5, 10, 15, 20, 30];
const MINUTE_STEP = 5;

const pad = (n: number) => String(n).padStart(2, '0');

export default function ReminderSettingsScreen() {
  const { user, updateProfile } = useAuth();
  const [settings, setSettings] = useState<ReminderSettings>(DEFAULT_REMINDER_SETTINGS);
  const [permissionGranted, setPermissionGranted] = useState(true);
  const [savingGoal, setSavingGoal] = useState(false);

  const refresh = useCallback(async () => {
    const [saved, permission] = await Promise.all([loadReminderSettings(), getReminderPermission()]);
    setSettings(saved);
    setPermissionGranted(permission.granted);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
      // The user may come back from the system settings after allowing notifications.
      const sub = AppState.addEventListener('change', (s) => {
        if (s === 'active') refresh();
      });
      return () => sub.remove();
    }, [refresh])
  );

  const persist = async (next: ReminderSettings) => {
    setSettings(next);
    await saveReminderSettings(next);
    await syncReminders();
  };

  const toggleReminders = async (enabled: boolean) => {
    if (!enabled) {
      await persist({ ...settings, enabled: false });
      return;
    }
    const permission = await requestReminderPermission();
    setPermissionGranted(permission.granted);
    if (!permission.granted) {
      Alert.alert(
        'Ruxsat kerak',
        permission.canAskAgain
          ? "Eslatmalar uchun bildirishnomalarga ruxsat bering."
          : "Bildirishnomalar o'chirilgan. Sozlamalarda ularni yoqing.",
        permission.canAskAgain
          ? [{ text: 'Yopish', style: 'cancel' }]
          : [
              { text: 'Yopish', style: 'cancel' },
              { text: 'Sozlamalarni ochish', onPress: () => Linking.openSettings() },
            ]
      );
      return;
    }
    await persist({ ...settings, enabled: true });
  };

  const changeGoal = async (goal: number) => {
    if (goal === user?.dailyGoal || savingGoal) return;
    setSavingGoal(true);
    try {
      await updateProfile({ dailyGoal: goal });
      await syncReminders();
    } catch (e) {
      Alert.alert('Xatolik', extractErrorMessage(e, "Maqsadni saqlab bo'lmadi"));
    } finally {
      setSavingGoal(false);
    }
  };

  const shiftHour = (delta: number) => persist({ ...settings, hour: (settings.hour + delta + 24) % 24 });
  const shiftMinute = (delta: number) =>
    persist({ ...settings, minute: (settings.minute + delta * MINUTE_STEP + 60) % 60 });

  const testReminder = async () => {
    await sendTestReminder();
    Alert.alert('Yuborildi', "5 soniyadan keyin sinov bildirishnomasi keladi. Ilovani yopib qo'yishingiz mumkin.");
  };

  const goal = user?.dailyGoal ?? 10;

  return (
    <ScreenContainer>
      <Text style={styles.sectionTitle}>Kunlik maqsad</Text>
      <Card style={styles.card}>
        <Text style={styles.cardText}>Kuniga nechta turli so'zni mashq qilmoqchisiz?</Text>
        <View style={styles.goalRow}>
          {GOAL_OPTIONS.map((g) => (
            <Pressable
              key={g}
              onPress={() => changeGoal(g)}
              style={[styles.goalChip, goal === g && styles.goalChipActive]}
            >
              <Text style={[styles.goalChipText, goal === g && styles.goalChipTextActive]}>{g}</Text>
            </Pressable>
          ))}
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Eslatma</Text>
      <Card style={styles.card}>
        <View style={styles.switchRow}>
          <View style={styles.switchTextWrap}>
            <Text style={styles.cardTitle}>Kunlik eslatma</Text>
            <Text style={styles.cardText}>Maqsad bajarilgan kuni eslatma kelmaydi</Text>
          </View>
          <Switch
            value={settings.enabled && permissionGranted}
            onValueChange={toggleReminders}
            trackColor={{ true: colors.primary, false: colors.border }}
          />
        </View>

        {settings.enabled && !permissionGranted && (
          <Pressable style={styles.warning} onPress={() => Linking.openSettings()}>
            <Ionicons name="warning-outline" size={16} color={colors.danger} />
            <Text style={styles.warningText}>Bildirishnomalar o'chirilgan. Sozlamalarni ochish</Text>
          </Pressable>
        )}

        {settings.enabled && permissionGranted && (
          <>
            <View style={styles.divider} />
            <View style={styles.timeRow}>
              <Stepper label="Soat" value={pad(settings.hour)} onMinus={() => shiftHour(-1)} onPlus={() => shiftHour(1)} />
              <Text style={styles.timeColon}>:</Text>
              <Stepper
                label="Daqiqa"
                value={pad(settings.minute)}
                onMinus={() => shiftMinute(-1)}
                onPlus={() => shiftMinute(1)}
              />
            </View>
            <Button title="Sinab ko'rish" variant="outline" onPress={testReminder} style={styles.testBtn} />
          </>
        )}
      </Card>

      <Text style={styles.note}>
        Ba'zi telefonlarda (masalan Xiaomi, Huawei) batareyani tejash rejimi bildirishnomalarni kechiktirishi mumkin.
        Kerak bo'lsa, ilova uchun batareya cheklovini o'chiring.
      </Text>
    </ScreenContainer>
  );
}

function Stepper({
  label,
  value,
  onMinus,
  onPlus,
}: {
  label: string;
  value: string;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <View style={styles.stepper}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperRow}>
        <Pressable hitSlop={8} onPress={onMinus} style={styles.stepperBtn}>
          <Ionicons name="remove" size={20} color={colors.primary} />
        </Pressable>
        <Text style={styles.stepperValue}>{value}</Text>
        <Pressable hitSlop={8} onPress={onPlus} style={styles.stepperBtn}>
          <Ionicons name="add" size={20} color={colors.primary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 10, marginTop: 4 },
  card: { marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  cardText: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  goalRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  goalChip: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center', backgroundColor: colors.border },
  goalChipActive: { backgroundColor: colors.primary },
  goalChipText: { fontSize: 15, fontWeight: '700', color: colors.textMuted },
  goalChipTextActive: { color: '#fff' },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  switchTextWrap: { flex: 1 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 14 },
  timeRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 12 },
  timeColon: { fontSize: 24, fontWeight: '700', color: colors.text, paddingBottom: 6 },
  stepper: { alignItems: 'center' },
  stepperLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 6 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.primary}1A`,
  },
  stepperValue: { fontSize: 28, fontWeight: '800', color: colors.text, minWidth: 44, textAlign: 'center' },
  testBtn: { marginTop: 16 },
  warning: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  warningText: { flex: 1, fontSize: 13, color: colors.danger },
  note: { fontSize: 12, color: colors.textMuted, lineHeight: 18, marginBottom: 20 },
});
