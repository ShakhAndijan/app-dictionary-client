import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../../components/Button';
import { colors, themed } from '../../theme/colors';
import * as learnApi from '../../api/learnApi';
import { ExamResult, ExamQuestion, FinishResult, LessonDetail, SKILL_META } from '../../api/learnApi';
import { extractErrorMessage } from '../../utils/errors';
import { requestProgressCheck } from '../../services/progressEvents';
import { LearnStackParamList } from '../../navigation/types';
import ExerciseView, { Context, ExerciseData } from './ExerciseView';

type Props = NativeStackScreenProps<LearnStackParamList, 'LearnPlay'>;

/** Plays one lesson or the level exam: intro (lessons only), the exercises one by one, then the result. */
export default function LearnPlayScreen({ route, navigation }: Props) {
  const exam = route.params.mode === 'exam';
  const code = route.params.code ?? '';

  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[] | null>(null);
  const [error, setError] = useState('');
  const [stage, setStage] = useState<'intro' | 'play' | 'done'>(exam ? 'play' : 'intro');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<{ key: string; answer: string }[]>([]);
  const [lessonResult, setLessonResult] = useState<FinishResult | null>(null);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  useEffect(() => {
    if (exam) {
      learnApi
        .getExam()
        .then(setQuestions)
        .catch((e) => setError(e?.response?.status === 409 ? "Imtihon hali ochilmagan: avval barcha darslarni o'zlashtiring." : extractErrorMessage(e, "Imtihonni yuklab bo'lmadi")));
    } else {
      learnApi
        .getLesson(code)
        .then((l) => {
          setLesson(l);
          navigation.setOptions({ title: l.title });
        })
        .catch((e) => setError(extractErrorMessage(e, "Darsni yuklab bo'lmadi")));
    }
  }, [exam, code, navigation]);

  useEffect(() => {
    if (exam) navigation.setOptions({ title: 'Daraja imtihoni' });
  }, [exam, navigation]);

  const items: ExerciseData[] | null = exam
    ? questions?.map((q) => ({ ...q, id: q.ref })) ?? null
    : lesson?.items ?? null;

  if (!items) {
    return (
      <View style={styles.center}>
        {error ? (
          <>
            <Text style={styles.error}>{error}</Text>
            <Button title="Orqaga" variant="outline" onPress={() => navigation.goBack()} style={{ marginTop: 12 }} />
          </>
        ) : (
          <ActivityIndicator color={colors.primary} />
        )}
      </View>
    );
  }

  const restart = () => {
    setIndex(0);
    setAnswers([]);
    setLessonResult(null);
    setExamResult(null);
    setError('');
    setStage('play');
  };

  const onDone = async (answer: string) => {
    const next = [...answers, { key: items[index].id, answer }];
    setAnswers(next);
    if (index + 1 < items.length) {
      setIndex(index + 1);
      return;
    }
    try {
      if (exam) {
        setExamResult(await learnApi.submitExam(next.map((a) => ({ ref: a.key, answer: a.answer }))));
      } else {
        setLessonResult(await learnApi.finishLesson(code, next.map((a) => ({ itemId: a.key, answer: a.answer }))));
      }
      setStage('done');
      requestProgressCheck();
    } catch (e) {
      setError(extractErrorMessage(e, "Natijani saqlab bo'lmadi"));
    }
  };

  if (stage === 'intro' && lesson) {
    const m = SKILL_META[lesson.skill];
    return (
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={[styles.badge, { color: m.tone }]}>
          {m.icon} {m.label} · {lesson.level}
        </Text>
        <Text style={styles.h1}>{lesson.topic}</Text>
        {lesson.intro ? <Text style={styles.body}>{lesson.intro}</Text> : null}
        <Context passage={lesson.passage} audioText={lesson.audioText} />
        <Text style={styles.meta}>{lesson.items.length} ta mashq · 70% dan yuqori natija darsni o'zlashtiradi</Text>
        <Button title="Boshlash" onPress={() => setStage('play')} />
      </ScrollView>
    );
  }

  if (stage === 'done' && (lessonResult || examResult)) {
    if (examResult) {
      return (
        <ScrollView contentContainerStyle={styles.page}>
          <Text style={styles.big}>{examResult.passed ? '🏆' : '📚'}</Text>
          <Text style={styles.h1}>{examResult.passed ? 'Imtihon topshirildi!' : "Imtihon topshirilmadi"}</Text>
          <Text style={styles.score}>{examResult.percent}%</Text>
          {examResult.newLevel ? <Text style={styles.good}>Yangi daraja: {examResult.newLevel}</Text> : null}
          <Text style={styles.meta}>+{examResult.xpGained} XP</Text>
          {examResult.skills.map((s) => (
            <View key={s.skill} style={styles.skillRow}>
              <Text style={styles.body}>
                {SKILL_META[s.skill].icon} {SKILL_META[s.skill].label}
              </Text>
              <Text style={styles.body}>
                {s.correct}/{s.total} · {s.percent}%
              </Text>
            </View>
          ))}
          <Button title="Kursga qaytish" onPress={() => navigation.popToTop()} />
        </ScrollView>
      );
    }
    const r = lessonResult!;
    const wrong = r.results.filter((x) => !x.correct);
    return (
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.big}>{r.passed ? '🏆' : '📚'}</Text>
        <Text style={styles.h1}>{r.passed ? "Dars o'zlashtirildi!" : "Yana urinib ko'ring"}</Text>
        <Text style={styles.score}>{r.score}%</Text>
        <Text style={styles.meta}>
          {r.total} ta mashqdan {r.correct} tasi to'g'ri · +{r.xpGained} XP
        </Text>
        {wrong.length > 0 && (
          <View style={styles.review}>
            <Text style={styles.h2}>Xatolar ustida ishlang</Text>
            {wrong.map((w) => {
              const it = lesson?.items.find((i) => i.id === w.itemId);
              return (
                <View key={w.itemId} style={styles.reviewRow}>
                  <Text style={styles.body}>{it?.prompt}</Text>
                  <Text style={styles.answer}>{w.answer}</Text>
                  {w.explain ? <Text style={styles.meta}>{w.explain}</Text> : null}
                </View>
              );
            })}
          </View>
        )}
        <Button title="Qayta bajarish" variant="outline" onPress={restart} />
        <Button title="Darslarga qaytish" onPress={() => navigation.goBack()} />
      </ScrollView>
    );
  }

  const item = items[index];
  return (
    <View style={styles.flex}>
      <View style={styles.steps}>
        <View style={[styles.stepsFill, { width: `${(index / items.length) * 100}%` }]} />
      </View>
      <Text style={styles.counter}>
        {index + 1} / {items.length}
      </Text>
      {error ? <Text style={[styles.error, { paddingHorizontal: 20 }]}>{error}</Text> : null}
      <ExerciseView
        key={item.id}
        item={item}
        last={index + 1 === items.length}
        instant={exam ? undefined : (answer) => learnApi.checkAnswer(code, item.id, answer)}
        onDone={onDone}
      />
    </View>
  );
}

const styles = themed(() =>
  StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: 20 },
    page: { padding: 20, gap: 14, backgroundColor: colors.background, flexGrow: 1 },
    error: { color: colors.danger, textAlign: 'center' },
    badge: { fontWeight: '700', fontSize: 14 },
    h1: { color: colors.text, fontSize: 24, fontWeight: '800' },
    h2: { color: colors.text, fontSize: 17, fontWeight: '700' },
    body: { color: colors.text, fontSize: 15, lineHeight: 22 },
    meta: { color: colors.textMuted, fontSize: 13 },
    big: { fontSize: 64, textAlign: 'center' },
    score: { color: colors.primary, fontSize: 48, fontWeight: '800', textAlign: 'center' },
    good: { color: colors.greenText, backgroundColor: colors.greenBg, padding: 10, borderRadius: 10, textAlign: 'center', overflow: 'hidden', fontWeight: '700' },
    skillRow: { flexDirection: 'row', justifyContent: 'space-between' },
    review: { gap: 10 },
    reviewRow: { backgroundColor: colors.surface, borderRadius: 12, padding: 12, gap: 4, borderWidth: 1, borderColor: colors.border },
    answer: { color: colors.secondary, fontWeight: '700', fontSize: 15 },
    steps: { height: 6, backgroundColor: colors.border },
    stepsFill: { height: 6, backgroundColor: colors.primary },
    counter: { color: colors.textMuted, textAlign: 'center', marginTop: 8, fontWeight: '600' },
  }),
);
