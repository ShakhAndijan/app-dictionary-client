import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import { colors } from '../../theme/colors';
import { DailyStats, MonthlyStats } from '../../types';
import * as statsApi from '../../api/statsApi';

type Mode = 'daily' | 'monthly';

export default function StatsScreen() {
  const [mode, setMode] = useState<Mode>('daily');
  const [daily, setDaily] = useState<DailyStats[]>([]);
  const [monthly, setMonthly] = useState<MonthlyStats[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [d, m] = await Promise.all([statsApi.getDailyStats(), statsApi.getMonthlyStats()]);
      setDaily(d);
      setMonthly(m);
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

  const rows = mode === 'daily' ? daily : monthly;

  return (
    <ScreenContainer>
      <View style={styles.toggleRow}>
        <Pressable
          style={[styles.toggleBtn, mode === 'daily' && styles.toggleBtnActive]}
          onPress={() => setMode('daily')}
        >
          <Text style={[styles.toggleText, mode === 'daily' && styles.toggleTextActive]}>Kunlik</Text>
        </Pressable>
        <Pressable
          style={[styles.toggleBtn, mode === 'monthly' && styles.toggleBtnActive]}
          onPress={() => setMode('monthly')}
        >
          <Text style={[styles.toggleText, mode === 'monthly' && styles.toggleTextActive]}>Oylik</Text>
        </Pressable>
      </View>

      {loading && <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />}

      {!loading && rows.length === 0 && <Text style={styles.emptyText}>Hali statistika mavjud emas</Text>}

      {!loading &&
        rows.map((row, idx) => {
          const label = mode === 'daily' ? (row as DailyStats).date : (row as MonthlyStats).month;
          const total = row.correctAnswers + row.incorrectAnswers;
          const accuracy = total > 0 ? Math.round((row.correctAnswers / total) * 100) : 0;
          return (
            <Card key={idx} style={styles.statCard}>
              <Text style={styles.statDate}>{label}</Text>
              <View style={styles.statRow}>
                <StatBlock label="Yangi so'z" value={row.wordsAdded} />
                <StatBlock label="Test" value={row.quizzesTaken} />
                <StatBlock label="To'g'ri %" value={`${accuracy}%`} />
              </View>
            </Card>
          );
        })}
    </ScreenContainer>
  );
}

function StatBlock({ label, value }: { label: string; value: number | string }) {
  return (
    <View style={styles.statBlock}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toggleRow: { flexDirection: 'row', backgroundColor: colors.border, borderRadius: 12, padding: 4, marginBottom: 20 },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: 'center' },
  toggleBtnActive: { backgroundColor: colors.surface },
  toggleText: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  toggleTextActive: { color: colors.text },
  loader: { marginTop: 40 },
  emptyText: { textAlign: 'center', color: colors.textMuted, marginTop: 40 },
  statCard: { marginBottom: 12 },
  statDate: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 12 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBlock: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 18, fontWeight: '700', color: colors.primary },
  statLabel: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
});
