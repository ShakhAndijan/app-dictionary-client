import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { ProfileStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { DailyStats, MonthlyStats } from '../../types';
import * as statsApi from '../../api/statsApi';
import * as reviewApi from '../../api/reviewApi';
import { dayKey, monthKey } from '../../utils/date';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileHome'>;

const MENU_ITEMS: {
  key: 'EditProfile' | 'ChangePassword' | 'Stats' | 'Reminders';
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}[] = [
  { key: 'EditProfile', label: 'Profilni tahrirlash', icon: 'person-outline', color: colors.primary },
  { key: 'ChangePassword', label: 'Parolni almashtirish', icon: 'lock-closed-outline', color: '#F59E0B' },
  { key: 'Stats', label: 'Statistika', icon: 'stats-chart-outline', color: colors.secondary },
  { key: 'Reminders', label: 'Eslatmalar va maqsad', icon: 'notifications-outline', color: '#EC4899' },
];

function accuracyOf(row: { correctAnswers: number; incorrectAnswers: number } | null): number {
  if (!row) return 0;
  const total = row.correctAnswers + row.incorrectAnswers;
  return total > 0 ? Math.round((row.correctAnswers / total) * 100) : 0;
}

export default function ProfileScreen({ navigation }: Props) {
  const { user, logout } = useAuth();

  const [daily, setDaily] = useState<DailyStats[]>([]);
  const [monthly, setMonthly] = useState<MonthlyStats[]>([]);
  const [goalInfo, setGoalInfo] = useState<{ done: number; goal: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [d, m, review] = await Promise.all([
        statsApi.getDailyStats().catch(() => []),
        statsApi.getMonthlyStats().catch(() => []),
        reviewApi.getReviewSummary().catch(() => null),
      ]);
      setDaily(d);
      setMonthly(m);
      if (review) setGoalInfo({ done: review.todayDone, goal: review.dailyGoal });
    } catch {
      // Keep previously loaded values on failure
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const today = new Date();
  const todayKey = dayKey(today);
  const thisMonthKey = monthKey(today);

  const todayStat = daily.find((d) => d.date === todayKey) ?? null;
  const monthStat = monthly.find((m) => m.month === thisMonthKey) ?? null;
  const quizToday = !!todayStat && todayStat.quizzesTaken > 0;
  const quizThisMonth = !!monthStat && monthStat.quizzesTaken > 0;
  const todayAccuracy = accuracyOf(todayStat);
  const monthAccuracy = accuracyOf(monthStat);

  const goToQuiz = () => {
    navigation.getParent()?.navigate('Baholash' as never);
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.firstName?.charAt(0).toUpperCase() ?? '?'}</Text>
        </View>
        <Text style={styles.name}>{user ? `${user.firstName} ${user.lastName}` : ''}</Text>
        {!!user?.username && <Text style={styles.username}>@{user.username}</Text>}
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {goalInfo && (
        <Pressable onPress={() => navigation.navigate('Reminders')}>
          <Card style={styles.activityCard}>
            <View style={styles.activityTopRow}>
              <View style={styles.activityTitleWrap}>
                <View style={[styles.activityIconWrap, goalInfo.done >= goalInfo.goal && styles.activityIconSuccess]}>
                  <Ionicons
                    name={goalInfo.done >= goalInfo.goal ? 'trophy' : 'flag-outline'}
                    size={18}
                    color={goalInfo.done >= goalInfo.goal ? colors.secondary : colors.textMuted}
                  />
                </View>
                <View>
                  <Text style={styles.activityTitle}>Bugungi maqsad</Text>
                  <Text style={styles.activitySubtitle}>
                    {goalInfo.done >= goalInfo.goal ? 'Maqsad bajarildi!' : "Kunlik so'zlar soni"}
                  </Text>
                </View>
              </View>
              <Text style={[styles.activityPercent, { color: goalInfo.done >= goalInfo.goal ? colors.secondary : colors.primary }]}>
                {goalInfo.done} / {goalInfo.goal}
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(100, Math.round((goalInfo.done / Math.max(1, goalInfo.goal)) * 100))}%`,
                    backgroundColor: goalInfo.done >= goalInfo.goal ? colors.secondary : colors.primary,
                  },
                ]}
              />
            </View>
          </Card>
        </Pressable>
      )}

      <Text style={styles.sectionTitle}>Baholash statistikasi</Text>

      <Card style={styles.activityCard}>
        <View style={styles.activityTopRow}>
          <View style={styles.activityTitleWrap}>
            <View style={[styles.activityIconWrap, quizToday && styles.activityIconSuccess]}>
              <Ionicons
                name={quizToday ? 'checkmark-circle' : 'time-outline'}
                size={18}
                color={quizToday ? colors.secondary : colors.textMuted}
              />
            </View>
            <View>
              <Text style={styles.activityTitle}>Bugungi baholash</Text>
              <Text style={styles.activitySubtitle}>
                {loading
                  ? 'Yuklanmoqda...'
                  : quizToday
                  ? `${todayStat!.quizzesTaken} ta test yechildi`
                  : 'Hali test yechilmagan'}
              </Text>
            </View>
          </View>
          <Text style={[styles.activityPercent, { color: quizToday ? colors.secondary : colors.textMuted }]}>
            {loading ? '—' : `${todayAccuracy}%`}
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${todayAccuracy}%`, backgroundColor: quizToday ? colors.secondary : colors.border },
            ]}
          />
        </View>
        {!loading && !quizToday && (
          <Button title="Baholashni boshlash" onPress={goToQuiz} style={styles.activityBtn} />
        )}
      </Card>

      <Card style={styles.activityCard}>
        <View style={styles.activityTopRow}>
          <View style={styles.activityTitleWrap}>
            <View style={[styles.activityIconWrap, quizThisMonth && styles.activityIconSuccess]}>
              <Ionicons
                name={quizThisMonth ? 'checkmark-circle' : 'time-outline'}
                size={18}
                color={quizThisMonth ? colors.secondary : colors.textMuted}
              />
            </View>
            <View>
              <Text style={styles.activityTitle}>Shu oylik baholash</Text>
              <Text style={styles.activitySubtitle}>
                {loading
                  ? 'Yuklanmoqda...'
                  : quizThisMonth
                  ? `${monthStat!.quizzesTaken} ta test yechildi`
                  : 'Bu oy hali test yechilmagan'}
              </Text>
            </View>
          </View>
          <Text style={[styles.activityPercent, { color: quizThisMonth ? colors.secondary : colors.textMuted }]}>
            {loading ? '—' : `${monthAccuracy}%`}
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${monthAccuracy}%`, backgroundColor: quizThisMonth ? colors.secondary : colors.border },
            ]}
          />
        </View>
      </Card>

      <Card style={styles.menuCard}>
        {MENU_ITEMS.map((item, idx) => (
          <React.Fragment key={item.key}>
            <Pressable style={styles.menuRow} onPress={() => navigation.navigate(item.key)}>
              <View style={[styles.menuIconWrap, { backgroundColor: `${item.color}1A` }]}>
                <Ionicons name={item.icon} size={18} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
            {idx < MENU_ITEMS.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </Card>

      <Button title="Chiqish" variant="outline" onPress={logout} style={styles.logoutBtn} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: 20 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 28, fontWeight: '700', color: '#fff' },
  name: { fontSize: 18, fontWeight: '700', color: colors.text },
  username: { fontSize: 13, color: colors.primary, fontWeight: '600', marginTop: 2 },
  email: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 10 },
  activityCard: { marginBottom: 12 },
  activityTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  activityTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 },
  activityIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIconSuccess: { backgroundColor: `${colors.secondary}1A` },
  activityTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  activitySubtitle: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  activityPercent: { fontSize: 22, fontWeight: '800' },
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: colors.border, marginTop: 12, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  activityBtn: { marginTop: 14 },
  menuCard: { padding: 0, overflow: 'hidden', marginTop: 8 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16 },
  menuIconWrap: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 15, color: colors.text, fontWeight: '500' },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 16 },
  logoutBtn: { marginTop: 24, marginBottom: 8 },
});
