import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import { colors, themed } from '../../theme/colors';
import * as learnApi from '../../api/learnApi';
import { ExamResult, ExamQuestion, FinishResult, LessonDetail, SKILL_META } from '../../api/learnApi';
import { extractErrorMessage } from '../../utils/errors';
import { requestProgressCheck } from '../../services/progressEvents';
import { LearnStackParamList } from '../../navigation/types';
import ExerciseView, { Context, ExerciseData } from './ExerciseView';
import ListeningView, { listeningGroups } from './ListeningView';
import { Bar, IconBadge, PASS_MARK, SKILL_ICON, courseStyles } from './learnUi';

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
            <Button title="Orqaga" variant="outline" onPress={() => navigation.goBack()} style={{ marginTop: 12, paddingHorizontal: 28 }} />
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
    await finish(next);
  };

  const finish = async (next: { key: string; answer: string }[]) => {
    setAnswers(next);
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
      <View style={styles.flex}>
        <ScrollView contentContainerStyle={styles.page}>
          <View style={styles.introHead}>
            <IconBadge name={SKILL_ICON[lesson.skill]} tone={m.tone} size={56} />
            <Text style={[styles.introSkill, { color: m.tone }]}>
              {m.label} · {lesson.level}
            </Text>
          </View>
          <Text style={styles.h1}>{lesson.topic}</Text>
          {lesson.intro ? <Text style={styles.body}>{lesson.intro}</Text> : null}
          <Context passage={lesson.passage} audioText={lesson.audioText} />
          <View style={[courseStyles.surface, styles.facts]}>
            <Fact icon="list" text={`${lesson.items.length} ta mashq`} />
            <Fact icon="flag" text={`${PASS_MARK}% va undan yuqori natija darsni o'zlashtiradi`} />
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <Button title="Boshlash" onPress={() => setStage('play')} />
        </View>
      </View>
    );
  }

  if (stage === 'done' && (lessonResult || examResult)) {
    if (examResult) {
      return (
        <View style={styles.flex}>
          <ScrollView contentContainerStyle={styles.page}>
            <ResultHead ok={examResult.passed} title={examResult.passed ? 'Imtihon topshirildi!' : 'Imtihon topshirilmadi'} percent={examResult.percent} sub={`+${examResult.xpGained} XP`} />
            {examResult.newLevel ? (
              <View style={styles.newLevel}>
                <Ionicons name="ribbon" size={20} color={colors.greenText} />
                <Text style={styles.newLevelText}>Yangi daraja: {examResult.newLevel}</Text>
              </View>
            ) : null}
            <View style={courseStyles.surface}>
              {examResult.skills.map((s, i) => (
                <View key={s.skill} style={[styles.skillRow, i < examResult.skills.length - 1 && courseStyles.rowDivider]}>
                  <IconBadge name={SKILL_ICON[s.skill]} tone={SKILL_META[s.skill].tone} size={36} />
                  <View style={{ flex: 1, gap: 6 }}>
                    <View style={styles.skillTop}>
                      <Text style={styles.skillName}>{SKILL_META[s.skill].label}</Text>
                      <Text style={styles.skillNum}>
                        {s.correct}/{s.total} · {s.percent}%
                      </Text>
                    </View>
                    <Bar pct={s.percent} tone={SKILL_META[s.skill].tone} mark={PASS_MARK} />
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
          <View style={styles.footer}>
            <Button title="Kursga qaytish" onPress={() => navigation.popToTop()} />
          </View>
        </View>
      );
    }
    const r = lessonResult!;
    const wrong = r.results.filter((x) => !x.correct);
    return (
      <View style={styles.flex}>
        <ScrollView contentContainerStyle={styles.page}>
          <ResultHead
            ok={r.passed}
            title={r.passed ? "Dars o'zlashtirildi!" : "Yana bir bor urinib ko'ring"}
            percent={r.score}
            sub={`${r.total} ta mashqdan ${r.correct} tasi to'g'ri · +${r.xpGained} XP`}
          />
          {wrong.length > 0 && (
            <View style={{ gap: 10 }}>
              <Text style={styles.h2}>Xatolar ustida ishlang</Text>
              {wrong.map((w) => {
                const it = lesson?.items.find((i) => i.id === w.itemId);
                return (
                  <View key={w.itemId} style={[courseStyles.surface, styles.reviewRow]}>
                    <Text style={styles.reviewPrompt}>{it?.prompt}</Text>
                    <View style={styles.reviewAnswer}>
                      <Ionicons name="checkmark-circle" size={18} color={colors.secondary} />
                      <Text style={styles.answer}>{w.answer}</Text>
                    </View>
                    {w.explain ? <Text style={styles.meta}>{w.explain}</Text> : null}
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
        <View style={styles.footer}>
          <Button title="Darslarga qaytish" onPress={() => navigation.goBack()} />
          <Button title="Qayta bajarish" variant="outline" onPress={restart} />
        </View>
      </View>
    );
  }

  const listening = !exam && stage === 'play' ? listeningGroups(items) : null;
  if (listening) {
    return (
      <View style={styles.flex}>
        {error ? <Text style={[styles.error, { paddingHorizontal: 20, paddingTop: 10 }]}>{error}</Text> : null}
        <ListeningView code={code} groups={listening} onFinish={finish} />
      </View>
    );
  }

  const item = items[index];
  return (
    <View style={styles.flex}>
      <View style={styles.topBar}>
        <View style={{ flex: 1 }}>
          <Bar pct={(index / items.length) * 100} height={8} />
        </View>
        <Text style={styles.counter}>
          {index + 1} / {items.length}
        </Text>
      </View>
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

function Fact({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.fact}>
      <Ionicons name={icon} size={18} color={colors.textMuted} />
      <Text style={styles.factText}>{text}</Text>
    </View>
  );
}

function ResultHead({ ok, title, percent, sub }: { ok: boolean; title: string; percent: number; sub: string }) {
  const tone = ok ? colors.secondary : colors.primary;
  return (
    <View style={styles.resultHead}>
      <View style={[styles.resultIcon, { backgroundColor: `${tone}22` }]}>
        <Ionicons name={ok ? 'trophy' : 'refresh'} size={34} color={tone} />
      </View>
      <Text style={styles.resultTitle}>{title}</Text>
      <Text style={[styles.score, { color: tone }]}>{percent}%</Text>
      <Bar pct={percent} tone={tone} height={8} mark={PASS_MARK} style={{ alignSelf: 'stretch' }} />
      <Text style={styles.meta}>{sub}</Text>
    </View>
  );
}

const styles = themed(() =>
  StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: 20 },
    page: { padding: 20, gap: 16, flexGrow: 1 },
    footer: { padding: 20, paddingTop: 12, gap: 10, backgroundColor: colors.background, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
    error: { color: colors.danger, textAlign: 'center' },
    introHead: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    introSkill: { fontWeight: '700', fontSize: 15 },
    h1: { color: colors.text, fontSize: 28, fontWeight: '800', letterSpacing: -0.5, lineHeight: 34 },
    h2: { color: colors.text, fontSize: 18, fontWeight: '800' },
    body: { color: colors.text, fontSize: 16, lineHeight: 24 },
    meta: { color: colors.textMuted, fontSize: 14, lineHeight: 20, textAlign: 'center' },
    facts: { padding: 16, gap: 12 },
    fact: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    factText: { color: colors.text, fontSize: 15, flex: 1, lineHeight: 21 },
    topBar: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 4 },
    counter: { color: colors.textMuted, fontWeight: '700', fontSize: 14, fontVariant: ['tabular-nums'] },
    resultHead: { alignItems: 'center', gap: 12, paddingTop: 12 },
    resultIcon: { width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center' },
    resultTitle: { color: colors.text, fontSize: 24, fontWeight: '800', letterSpacing: -0.4, textAlign: 'center' },
    score: { fontSize: 54, fontWeight: '800', letterSpacing: -1.5 },
    newLevel: { flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center', backgroundColor: colors.greenBg, borderRadius: 14, padding: 14 },
    newLevelText: { color: colors.greenText, fontWeight: '800', fontSize: 16 },
    skillRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
    skillTop: { flexDirection: 'row', justifyContent: 'space-between' },
    skillName: { color: colors.text, fontWeight: '700', fontSize: 15 },
    skillNum: { color: colors.textMuted, fontSize: 13, fontVariant: ['tabular-nums'] },
    reviewRow: { padding: 14, gap: 8 },
    reviewPrompt: { color: colors.text, fontSize: 15, lineHeight: 22 },
    reviewAnswer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    answer: { color: colors.greenText, fontWeight: '700', fontSize: 15, flex: 1 },
  }),
);
