import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { colors, themed } from '../../theme/colors';
import * as learnApi from '../../api/learnApi';
import { Overview, SKILL_META, SKILL_ORDER } from '../../api/learnApi';
import { extractErrorMessage } from '../../utils/errors';
import { LearnStackParamList } from '../../navigation/types';

const LEVEL_TEXT: Record<string, string> = {
  A1: 'Boshlang\'ich',
  A2: 'Elementar',
  B1: "O'rta",
  B2: "O'rta-yuqori",
  C1: 'Ilg\'or',
};

export default function LearnHomeScreen() {
  const nav = useNavigation<NativeStackNavigationProp<LearnStackParamList>>();
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState('');
  const [picking, setPicking] = useState(false);

  const load = useCallback(() => {
    learnApi
      .getOverview()
      .then((o) => {
        setData(o);
        setError('');
      })
      .catch((e) => setError(extractErrorMessage(e, "Kursni yuklab bo'lmadi")));
  }, []);

  useFocusEffect(load);

  const choose = async (level: string) => {
    try {
      setData(await learnApi.setLevel(level));
      setPicking(false);
    } catch (e) {
      setError(extractErrorMessage(e, "Darajani saqlab bo'lmadi"));
    }
  };

  if (!data) {
    return (
      <ScreenContainer>
        {error ? <Text style={styles.error}>{error}</Text> : <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />}
        {error ? <Button title="Qayta urinish" onPress={load} /> : null}
      </ScreenContainer>
    );
  }

  if (!data.level || picking) {
    return (
      <ScreenContainer>
        <Text style={styles.title}>Ingliz tili kursi</Text>
        <Text style={styles.sub}>Darajangizni tanlang. Keyin uni istalgan payt o'zgartirishingiz mumkin.</Text>
        {data.levels.map((l) => (
          <Pressable key={l} style={styles.levelRow} onPress={() => choose(l)}>
            <Text style={styles.levelCode}>{l}</Text>
            <Text style={styles.levelName}>{LEVEL_TEXT[l] ?? ''}</Text>
          </Pressable>
        ))}
        {data.level ? <Button title="Bekor qilish" variant="outline" onPress={() => setPicking(false)} style={{ marginTop: 8 }} /> : null}
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.headRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Ingliz tili · {data.level}</Text>
          <Text style={styles.sub}>{LEVEL_TEXT[data.level] ?? ''} daraja</Text>
        </View>
        <Pressable onPress={() => setPicking(true)} hitSlop={8}>
          <Text style={styles.link}>Darajani o'zgartirish</Text>
        </Pressable>
      </View>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Daraja bo'yicha jarayon</Text>
        <View style={styles.bar}>
          <View style={[styles.barFill, { width: `${data.progress.percent}%` }]} />
        </View>
        <Text style={styles.sub}>
          {data.progress.passed} / {data.progress.total} dars o'zlashtirildi ({data.progress.percent}%)
        </Text>
        {data.examUnlocked ? (
          <Button title="Daraja imtihoni" onPress={() => nav.navigate('LearnPlay', { mode: 'exam' })} style={{ marginTop: 10 }} />
        ) : (
          <Text style={styles.hint}>Barcha darslar o'zlashtirilgach daraja imtihoni ochiladi.</Text>
        )}
        {data.lastExam ? (
          <Text style={styles.hint}>
            Oxirgi imtihon: {data.lastExam.percent}% {data.lastExam.passed ? '(topshirildi)' : '(topshirilmadi)'}
          </Text>
        ) : null}
      </Card>

      <Text style={styles.section}>Bugungi maqsadlar</Text>
      {data.goalsDone ? <Text style={styles.done}>🎉 Bugungi maqsadlar bajarildi!</Text> : null}
      {data.goals.map((g) => {
        const m = SKILL_META[g.skill];
        const next = g.suggested[0];
        return (
          <Card key={g.skill} style={styles.goal}>
            <View style={styles.goalRow}>
              <Text style={styles.goalTitle}>
                {m.icon} {m.label}
              </Text>
              <Text style={styles.goalCount}>
                {g.done} / {g.target}
              </Text>
            </View>
            {next ? (
              <Pressable onPress={() => nav.navigate('LearnPlay', { mode: 'lesson', code: next.code })}>
                <Text style={styles.link}>Davom etish: {next.title}</Text>
              </Pressable>
            ) : null}
          </Card>
        );
      })}

      <Text style={styles.section}>Ko'nikmalar</Text>
      {SKILL_ORDER.map((s) => {
        const m = SKILL_META[s];
        const sk = data.skills.find((x) => x.skill === s);
        return (
          <Pressable key={s} onPress={() => nav.navigate('LearnLessons', { skill: s })}>
            <Card style={styles.skill}>
              <Text style={[styles.skillIcon, { backgroundColor: `${m.tone}22` }]}>{m.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.goalTitle}>{m.label}</Text>
                <Text style={styles.sub}>
                  {sk?.lessonsPassed ?? 0} / {sk?.lessonsTotal ?? 0} dars
                </Text>
              </View>
              <Text style={styles.chev}>›</Text>
            </Card>
          </Pressable>
        );
      })}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </ScreenContainer>
  );
}

const styles = themed(() =>
  StyleSheet.create({
    headRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
    title: { color: colors.text, fontSize: 24, fontWeight: '800' },
    sub: { color: colors.textMuted, fontSize: 14, marginTop: 2 },
    link: { color: colors.primary, fontWeight: '600', fontSize: 14 },
    card: { gap: 8, marginBottom: 8 },
    cardTitle: { color: colors.text, fontWeight: '700', fontSize: 16 },
    bar: { height: 10, borderRadius: 5, backgroundColor: colors.border, overflow: 'hidden' },
    barFill: { height: 10, backgroundColor: colors.primary },
    hint: { color: colors.textMuted, fontSize: 13 },
    section: { color: colors.text, fontWeight: '700', fontSize: 17, marginTop: 18, marginBottom: 8 },
    done: { color: colors.greenText, backgroundColor: colors.greenBg, padding: 10, borderRadius: 10, marginBottom: 8, overflow: 'hidden' },
    goal: { marginBottom: 8, gap: 6 },
    goalRow: { flexDirection: 'row', justifyContent: 'space-between' },
    goalTitle: { color: colors.text, fontWeight: '700', fontSize: 16 },
    goalCount: { color: colors.textMuted, fontWeight: '600' },
    skill: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
    skillIcon: { width: 44, height: 44, borderRadius: 12, textAlign: 'center', textAlignVertical: 'center', fontSize: 22, overflow: 'hidden', lineHeight: 44 },
    chev: { color: colors.textMuted, fontSize: 24 },
    levelRow: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.surface, borderRadius: 14, padding: 16, marginTop: 10, borderWidth: 1, borderColor: colors.border },
    levelCode: { color: colors.primary, fontWeight: '800', fontSize: 22, width: 48 },
    levelName: { color: colors.text, fontSize: 16 },
    error: { color: colors.danger, marginVertical: 10 },
  }),
);
