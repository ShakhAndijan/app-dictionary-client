import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Button from '../../components/Button';
import { colors, themed } from '../../theme/colors';
import * as learnApi from '../../api/learnApi';
import { Overview, SKILL_META, SKILL_ORDER } from '../../api/learnApi';
import { extractErrorMessage } from '../../utils/errors';
import { LearnStackParamList } from '../../navigation/types';
import { Bar, IconBadge, SKILL_ICON, SectionTitle, courseStyles } from './learnUi';

const LEVEL_INFO: Record<string, { title: string; sub: string }> = {
  A1: { title: "Boshlang'ich", sub: "Oddiy so'z va gaplar, o'zingiz haqingizda gapirish" },
  A2: { title: 'Elementar', sub: 'Kundalik mavzular, oddiy suhbatlar' },
  B1: { title: "O'rta", sub: 'Fikr bildirish, sayohat va ish bo\'yicha suhbat' },
  B2: { title: "O'rta-yuqori", sub: 'Murakkab matnlarni tushunish va erkin gapirish' },
  C1: { title: "Ilg'or", sub: 'Deyarli ona tili darajasida erkin muloqot' },
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
        {error ? (
          <>
            <Text style={styles.error}>{error}</Text>
            <Button title="Qayta urinish" onPress={load} />
          </>
        ) : (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 60 }} />
        )}
      </ScreenContainer>
    );
  }

  if (!data.level || picking) {
    return (
      <ScreenContainer>
        <Text style={styles.title}>Darajangizni tanlang</Text>
        <Text style={styles.lead}>Bilmasangiz, A1 dan boshlang. Daraja imtihonini topshirib, keyingisiga o'tasiz.</Text>
        <View style={{ gap: 10, marginTop: 18 }}>
          {data.levels.map((l) => {
            const on = l === data.level;
            return (
              <Pressable key={l} style={[styles.levelRow, on && styles.levelRowOn]} onPress={() => choose(l)}>
                <Text style={[styles.levelCode, on && { color: colors.primary }]}>{l}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.levelName}>{LEVEL_INFO[l]?.title ?? ''}</Text>
                  <Text style={styles.levelSub}>{LEVEL_INFO[l]?.sub ?? ''}</Text>
                </View>
                {on ? <Ionicons name="checkmark-circle" size={22} color={colors.primary} /> : <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />}
              </Pressable>
            );
          })}
        </View>
        {data.level ? <Button title="Bekor qilish" variant="outline" onPress={() => setPicking(false)} style={{ marginTop: 16 }} /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScreenContainer>
    );
  }

  // Where to continue: the first lesson of the first goal that is not finished yet.
  const open = data.goals.find((g) => g.done < g.target && g.suggested[0]) ?? data.goals.find((g) => g.suggested[0]);
  const next = open?.suggested[0];
  const goalsTotal = data.goals.reduce((s, g) => s + g.target, 0);
  const goalsDone = data.goals.reduce((s, g) => s + Math.min(g.done, g.target), 0);

  return (
    <ScreenContainer>
      <View style={styles.head}>
        <Text style={styles.title}>Ingliz tili</Text>
        <Pressable style={styles.iconBtn} onPress={() => nav.navigate('LearnStats')} hitSlop={8} accessibilityLabel="Statistika">
          <Ionicons name="stats-chart" size={20} color={colors.text} />
        </Pressable>
      </View>

      <Pressable style={styles.levelChip} onPress={() => setPicking(true)} hitSlop={6}>
        <Text style={styles.levelChipCode}>{data.level}</Text>
        <Text style={styles.levelChipText}>{LEVEL_INFO[data.level]?.title} daraja</Text>
        <Ionicons name="chevron-down" size={15} color={colors.textMuted} />
      </Pressable>

      <View style={[courseStyles.surface, styles.progress]}>
        <View style={styles.progressTop}>
          <Text style={styles.progressMain}>
            {data.progress.passed} <Text style={styles.progressOf}>/ {data.progress.total} dars</Text>
          </Text>
          <Text style={styles.progressPct}>{data.progress.percent}%</Text>
        </View>
        <Bar pct={data.progress.percent} height={8} />
        <View style={styles.dayRow}>
          <Text style={styles.dayText}>{data.goalsDone ? 'Bugungi maqsadlar bajarildi' : `Bugun: ${goalsDone} / ${goalsTotal}`}</Text>
          <View style={styles.dots}>
            {data.goals.map((g) => (
              <View key={g.skill} style={[styles.dot, g.done >= g.target && { backgroundColor: SKILL_META[g.skill].tone }]} />
            ))}
          </View>
        </View>
      </View>

      {next && open ? (
        <Pressable
          style={({ pressed }) => [styles.cont, { backgroundColor: SKILL_META[open.skill].tone }, pressed && { opacity: 0.9 }]}
          onPress={() => nav.navigate('LearnPlay', { mode: 'lesson', code: next.code })}
        >
          <View style={styles.contIcon}>
            <Ionicons name={SKILL_ICON[open.skill]} size={24} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.contLabel}>Davom etish · {SKILL_META[open.skill].label}</Text>
            <Text style={styles.contTitle} numberOfLines={1}>
              {next.title}
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={22} color="#fff" />
        </Pressable>
      ) : null}

      <SectionTitle>Yo'nalishlar</SectionTitle>
      <View style={courseStyles.surface}>
        {SKILL_ORDER.map((s, i) => {
          const m = SKILL_META[s];
          const sk = data.skills.find((x) => x.skill === s);
          const g = data.goals.find((x) => x.skill === s);
          const total = sk?.lessonsTotal ?? 0;
          const passed = sk?.lessonsPassed ?? 0;
          const goalOk = !!g && g.done >= g.target;
          return (
            <Pressable
              key={s}
              disabled={total === 0}
              style={({ pressed }) => [styles.skill, i < SKILL_ORDER.length - 1 && courseStyles.rowDivider, pressed && { opacity: 0.7 }]}
              onPress={() => nav.navigate('LearnLessons', { skill: s })}
            >
              <IconBadge name={SKILL_ICON[s]} tone={m.tone} />
              <View style={{ flex: 1, gap: 6 }}>
                <View style={styles.skillTop}>
                  <Text style={styles.skillName}>{m.label}</Text>
                  <Text style={styles.skillCount}>{total ? `${passed} / ${total}` : 'Tez orada'}</Text>
                </View>
                <Bar pct={total ? (passed / total) * 100 : 0} tone={m.tone} height={5} />
              </View>
              {goalOk ? (
                <Ionicons name="checkmark-circle" size={20} color={colors.secondary} />
              ) : (
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              )}
            </Pressable>
          );
        })}
      </View>

      <Pressable
        disabled={!data.examUnlocked}
        style={({ pressed }) => [courseStyles.surface, styles.exam, !data.examUnlocked && { opacity: 0.7 }, pressed && { opacity: 0.8 }]}
        onPress={() => nav.navigate('LearnPlay', { mode: 'exam' })}
      >
        <IconBadge name={data.examUnlocked ? 'school' : 'lock-closed'} tone={data.examUnlocked ? colors.primary : colors.textMuted} />
        <View style={{ flex: 1 }}>
          <Text style={styles.skillName}>{data.level} daraja imtihoni</Text>
          <Text style={styles.examSub}>
            {data.lastExam
              ? `Oxirgi natija: ${data.lastExam.percent}% · ${data.lastExam.passed ? 'topshirildi' : 'topshirilmadi'}`
              : data.examUnlocked
              ? 'Keyingi darajaga o\'tish uchun'
              : "Barcha darslar o'zlashtirilgach ochiladi"}
          </Text>
        </View>
        {data.examUnlocked ? <Ionicons name="chevron-forward" size={18} color={colors.textMuted} /> : null}
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </ScreenContainer>
  );
}

const styles = themed(() =>
  StyleSheet.create({
    head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    title: { color: colors.text, fontSize: 30, fontWeight: '800', letterSpacing: -0.6 },
    lead: { color: colors.textMuted, fontSize: 15, lineHeight: 22, marginTop: 6 },
    iconBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
    levelChip: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', marginTop: 8, marginBottom: 18, paddingVertical: 6, paddingLeft: 6, paddingRight: 12, borderRadius: 20, backgroundColor: colors.indigoBg },
    levelChipCode: { color: '#fff', backgroundColor: colors.primary, fontWeight: '800', fontSize: 13, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 14, overflow: 'hidden' },
    levelChipText: { color: colors.indigoText, fontWeight: '600', fontSize: 14 },
    progress: { padding: 18, gap: 12 },
    progressTop: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
    progressMain: { color: colors.text, fontSize: 22, fontWeight: '800' },
    progressOf: { color: colors.textMuted, fontSize: 15, fontWeight: '500' },
    progressPct: { color: colors.primary, fontSize: 16, fontWeight: '700' },
    dayRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
    dayText: { color: colors.textMuted, fontSize: 13.5 },
    dots: { flexDirection: 'row', gap: 6 },
    dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.border },
    cont: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 18, padding: 16, marginTop: 14 },
    contIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center' },
    contLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '600' },
    contTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginTop: 2 },
    skill: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 16 },
    skillTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
    skillName: { color: colors.text, fontSize: 16, fontWeight: '700' },
    skillCount: { color: colors.textMuted, fontSize: 13, fontVariant: ['tabular-nums'] },
    exam: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, marginTop: 12 },
    examSub: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
    error: { color: colors.danger, marginVertical: 12 },
    levelRow: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1.5, borderColor: colors.border },
    levelRowOn: { borderColor: colors.primary },
    levelCode: { color: colors.text, fontWeight: '800', fontSize: 24, width: 48 },
    levelName: { color: colors.text, fontSize: 16, fontWeight: '700' },
    levelSub: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  }),
);
