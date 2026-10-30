import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { colors, themed } from '../../theme/colors';
import { QuizPromptType, ReviewSummary } from '../../types';
import * as quizApi from '../../api/quizApi';
import { QuizMode } from '../../api/quizApi';
import { extractErrorMessage, isNetworkError } from '../../utils/errors';
import * as wordsApi from '../../api/wordsApi';
import { isOnline } from '../../services/connectivity';
import { enqueueAnswer } from '../../services/offlineSync';
import { LocalQuestion, LocalRound, nextLocalQuestion, startLocalRound } from '../../services/offlineSpeed';
import { syncReminders } from '../../services/reminders';
import { requestProgressCheck } from '../../services/progressEvents';

interface Props {
  review: ReviewSummary | null;
  totalWords: number;
  onExit: () => void;
}

type Stage = 'choose' | 'play' | 'done';

interface Question {
  promptType: QuizPromptType;
  promptText: string;
  options: string[];
}

interface Tally {
  correct: number;
  answered: number;
  combo: number;
  bestCombo: number;
}

const ROUND_SECONDS = 60;
const FEEDBACK_MS = 500;
const MIN_WORDS = 4;
const BEST_KEY = 'speed_round_best';
const EMPTY_TALLY: Tally = { correct: 0, answered: 0, combo: 0, bestCombo: 0 };

const QUESTION_LABEL: Record<QuizPromptType, string> = {
  english: "O'zbekcha tarjimasi qaysi?",
  uzbek: "Inglizcha so'zi qaysi?",
  definition: "Bu ta'rif qaysi so'zga tegishli?",
};

export default function SpeedRoundView({ review, totalWords, onExit }: Props) {
  const [stage, setStage] = useState<Stage>('choose');
  const [loading, setLoading] = useState(false);
  const [best, setBest] = useState(0);
  const [newRecord, setNewRecord] = useState(false);

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [msLeft, setMsLeft] = useState(ROUND_SECONDS * 1000);
  const [tally, setTally] = useState<Tally>(EMPTY_TALLY);
  const [feedback, setFeedback] = useState<{ chosen: string; correctAnswer: string; correct: boolean } | null>(null);

  // Refs hold what timers and async callbacks need to read without going stale.
  const endAt = useRef(0);
  const busy = useRef(false);
  const over = useRef(false);
  const tallyRef = useRef<Tally>(EMPTY_TALLY);
  const sessionRef = useRef<number | null>(null);
  // Set while the round is played from the phone's own words (no internet).
  const localRef = useRef<{ round: LocalRound; current: LocalQuestion } | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(BEST_KEY)
      .then((v) => setBest(v ? Number(v) || 0 : 0))
      .catch(() => undefined);
  }, []);

  const finish = async () => {
    if (over.current) return;
    over.current = true;
    const result = tallyRef.current;
    if (sessionRef.current !== null) {
      quizApi.finishQuiz(sessionRef.current).catch(() => undefined);
    }
    let previousBest = 0;
    try {
      previousBest = Number((await AsyncStorage.getItem(BEST_KEY)) ?? 0) || 0;
      if (result.correct > previousBest) await AsyncStorage.setItem(BEST_KEY, String(result.correct));
    } catch {
      // The record is a nicety; losing it must not break the result screen.
    }
    setNewRecord(result.correct > previousBest && result.correct > 0);
    setBest(Math.max(previousBest, result.correct));
    setTally(result);
    setStage('done');
    syncReminders();
    requestProgressCheck();
  };

  useEffect(() => {
    if (stage !== 'play') return undefined;
    const timer = setInterval(() => {
      const left = endAt.current - Date.now();
      if (left <= 0) {
        clearInterval(timer);
        setMsLeft(0);
        // An answer still waiting for the server will see `over` and stop; finish right away otherwise.
        if (!busy.current) finish();
      } else {
        setMsLeft(left);
      }
    }, 100);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const beginLocal = async (mode: QuizMode) => {
    const round = startLocalRound(mode === 'WEAK' ? 'WEAK' : 'ALL', await wordsApi.getWords());
    if (!round) {
      Alert.alert('Offlayn', "Bu to'plam uchun saqlangan so'zlar yetarli emas.");
      return;
    }
    const first = nextLocalQuestion(round);
    localRef.current = { round, current: first };
    sessionRef.current = null;
    setSessionId(null);
    setQuestion({ promptType: first.promptType, promptText: first.promptText, options: first.options });
    tallyRef.current = EMPTY_TALLY;
    setTally(EMPTY_TALLY);
    setFeedback(null);
    busy.current = false;
    over.current = false;
    setNewRecord(false);
    setMsLeft(ROUND_SECONDS * 1000);
    endAt.current = Date.now() + ROUND_SECONDS * 1000;
    setStage('play');
  };

  const pickLocal = (option: string) => {
    const local = localRef.current;
    if (!local || busy.current || over.current) return;
    busy.current = true;
    const correct = option === local.current.answer;
    enqueueAnswer(local.current.word.id, correct, 'SPEED').catch(() => undefined);
    const t = tallyRef.current;
    const combo = correct ? t.combo + 1 : 0;
    tallyRef.current = {
      correct: t.correct + (correct ? 1 : 0),
      answered: t.answered + 1,
      combo,
      bestCombo: Math.max(t.bestCombo, combo),
    };
    setTally(tallyRef.current);
    setFeedback({ chosen: option, correctAnswer: local.current.answer, correct });
    setTimeout(() => {
      busy.current = false;
      if (over.current) return;
      if (Date.now() >= endAt.current) {
        finish();
        return;
      }
      const next = nextLocalQuestion(local.round);
      local.current = next;
      setQuestion({ promptType: next.promptType, promptText: next.promptText, options: next.options });
      setFeedback(null);
    }, FEEDBACK_MS);
  };

  const begin = async (mode: QuizMode) => {
    setLoading(true);
    localRef.current = null;
    try {
      if (!isOnline()) {
        await beginLocal(mode);
        return;
      }
      const q = await quizApi.startQuiz(mode, 'SPEED');
      sessionRef.current = q.sessionId;
      setSessionId(q.sessionId);
      setQuestion({ promptType: q.promptType, promptText: q.promptText, options: q.options ?? [] });
      tallyRef.current = EMPTY_TALLY;
      setTally(EMPTY_TALLY);
      setFeedback(null);
      busy.current = false;
      over.current = false;
      setNewRecord(false);
      setMsLeft(ROUND_SECONDS * 1000);
      endAt.current = Date.now() + ROUND_SECONDS * 1000;
      setStage('play');
    } catch (e: any) {
      if (isNetworkError(e)) {
        // The server went away just now: play from the phone's words instead.
        try {
          await beginLocal(mode);
          return;
        } catch {
          // fall through to the message below
        }
      }
      Alert.alert('Xatolik', extractErrorMessage(e, "Raundni boshlab bo'lmadi"));
    } finally {
      setLoading(false);
    }
  };

  const pick = async (option: string) => {
    if (localRef.current) {
      pickLocal(option);
      return;
    }
    if (busy.current || over.current || sessionId === null || !question) return;
    busy.current = true;
    try {
      const res = await quizApi.submitQuizAnswer(sessionId, option);
      const t = tallyRef.current;
      const combo = res.correct ? t.combo + 1 : 0;
      tallyRef.current = {
        correct: t.correct + (res.correct ? 1 : 0),
        answered: t.answered + 1,
        combo,
        bestCombo: Math.max(t.bestCombo, combo),
      };
      setTally(tallyRef.current);
      setFeedback({ chosen: option, correctAnswer: res.correctAnswer, correct: res.correct });
      setTimeout(() => {
        busy.current = false;
        if (over.current) return;
        if (Date.now() >= endAt.current || !res.nextPromptText || !res.nextPromptType) {
          finish();
          return;
        }
        setQuestion({ promptType: res.nextPromptType, promptText: res.nextPromptText, options: res.nextOptions ?? [] });
        setFeedback(null);
      }, FEEDBACK_MS);
    } catch (e: any) {
      busy.current = false;
      Alert.alert('Xatolik', extractErrorMessage(e, "Javobni yuborib bo'lmadi"));
    }
  };

  const leave = () => {
    over.current = true;
    onExit();
  };

  if (stage === 'choose') {
    const canPlay = totalWords >= MIN_WORDS;
    const pools: { mode: QuizMode; title: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap; color: string; enabled: boolean }[] = [
      {
        mode: 'ALL',
        title: "Tasodifiy so'zlar",
        subtitle: `Butun lug'atingizdan (${totalWords} ta so'z)`,
        icon: 'shuffle-outline',
        color: colors.secondary,
        enabled: canPlay,
      },
      {
        mode: 'WEAK',
        title: "Zaif so'zlar",
        subtitle: (review?.weakCount ?? 0) > 0 ? `${review?.weakCount} ta so'z ko'p xato qilingan` : "Hozircha zaif so'z yo'q",
        icon: 'flash-outline',
        color: colors.danger,
        enabled: canPlay && (review?.weakCount ?? 0) > 0,
      },
    ];
    return (
      <ScreenContainer>
        <View style={styles.topRow}>
          <Pressable onPress={leave} hitSlop={10} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </Pressable>
          <Text style={styles.topTitle}>Tez raund</Text>
          {best > 0 && (
            <View style={styles.bestChip}>
              <Ionicons name="trophy" size={13} color="#B45309" />
              <Text style={styles.bestChipText}>Rekord: {best}</Text>
            </View>
          )}
        </View>
        <Text style={styles.hint}>
          {ROUND_SECONDS} soniyada iloji boricha ko'p savolga javob bering. Har savolda 4 ta variant bor, xato qilsangiz ketma-ket
          to'g'ri javoblar (combo) uziladi. Javoblar takrorlash jadvaliga ta'sir qiladi (faqat 3-qutigacha).
          {canPlay ? '' : `\n\nBuning uchun kamida ${MIN_WORDS} ta so'z kerak.`}
        </Text>
        {pools.map((p) => (
          <Pressable
            key={p.mode}
            style={({ pressed }) => [styles.modeCard, (!p.enabled || loading) && styles.disabled, pressed && styles.pressed]}
            disabled={!p.enabled || loading}
            onPress={() => begin(p.mode)}
          >
            <View style={[styles.modeIcon, { backgroundColor: `${p.color}1A` }]}>
              <Ionicons name={p.icon} size={22} color={p.color} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.modeTitle}>{p.title}</Text>
              <Text style={styles.modeSubtitle}>{p.subtitle}</Text>
            </View>
            <Ionicons name="play" size={18} color={colors.textMuted} />
          </Pressable>
        ))}
        {loading && <ActivityIndicator color={colors.primary} style={styles.loader} />}
      </ScreenContainer>
    );
  }

  if (stage === 'done') {
    const accuracy = tally.answered > 0 ? Math.round((tally.correct / tally.answered) * 100) : 0;
    return (
      <ScreenContainer>
        <Card style={styles.resultCard}>
          <View style={[styles.trophy, { backgroundColor: newRecord ? colors.amberBg : `${colors.primary}1A` }]}>
            <Ionicons name={newRecord ? 'trophy' : 'timer'} size={38} color={newRecord ? '#F59E0B' : colors.primary} />
          </View>
          <Text style={styles.score}>{tally.correct}</Text>
          <Text style={styles.resultText}>
            {newRecord ? 'Yangi rekord! ' : ''}
            {ROUND_SECONDS} soniyada to'g'ri javoblar
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{tally.answered}</Text>
              <Text style={styles.statLabel}>Javob</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: colors.secondary }]}>{accuracy}%</Text>
              <Text style={styles.statLabel}>Aniqlik</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: '#F59E0B' }]}>{tally.bestCombo}</Text>
              <Text style={styles.statLabel}>Eng uzun combo</Text>
            </View>
          </View>
          <Text style={styles.bestLine}>Rekordingiz: {best}</Text>
        </Card>
        <Button title="Qayta o'ynash" onPress={() => setStage('choose')} />
        <Button title="Tugatish" variant="outline" onPress={leave} style={styles.gap} />
      </ScreenContainer>
    );
  }

  const secondsLeft = Math.ceil(msLeft / 1000);
  const urgent = secondsLeft <= 10;
  const barPct = Math.max(0, Math.min(100, (msLeft / (ROUND_SECONDS * 1000)) * 100));

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <Pressable onPress={leave} hitSlop={10} style={styles.iconBtn}>
          <Ionicons name="close" size={20} color={colors.text} />
        </Pressable>
        <View style={styles.flex}>
          <Text style={styles.topTitle}>Tez raund</Text>
        </View>
        {tally.combo >= 2 && (
          <View style={styles.comboChip}>
            <Ionicons name="flame" size={14} color="#EA580C" />
            <Text style={styles.comboText}>x{tally.combo}</Text>
          </View>
        )}
        <Text style={[styles.timer, urgent && styles.timerUrgent]}>{secondsLeft}s</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${barPct}%` }, urgent && styles.barUrgent]} />
      </View>

      <Text style={styles.scoreLine}>To'g'ri: {tally.correct}</Text>

      {question && (
        <Card>
          <Text style={styles.label}>{QUESTION_LABEL[question.promptType]}</Text>
          <Text style={styles.prompt}>{question.promptText}</Text>
          {question.options.map((opt) => {
            const isRight = !!feedback && opt === feedback.correctAnswer;
            const isWrongPick = !!feedback && !feedback.correct && opt === feedback.chosen;
            return (
              <Pressable
                key={opt}
                style={({ pressed }) => [
                  styles.option,
                  isRight && styles.optionRight,
                  isWrongPick && styles.optionWrong,
                  pressed && !feedback && styles.pressed,
                ]}
                disabled={!!feedback}
                onPress={() => pick(opt)}
              >
                <Text style={styles.optionText}>{opt}</Text>
                {isRight && <Ionicons name="checkmark-circle" size={20} color={colors.secondary} />}
                {isWrongPick && <Ionicons name="close-circle" size={20} color={colors.danger} />}
              </Pressable>
            );
          })}
        </Card>
      )}
    </ScreenContainer>
  );
}

const styles = themed(() => StyleSheet.create({
  flex: { flex: 1 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  topTitle: { flex: 1, fontSize: 17, fontWeight: '700', color: colors.text },
  hint: { fontSize: 13, color: colors.textMuted, lineHeight: 19, marginBottom: 16 },
  bestChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.amberBg, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5 },
  bestChipText: { fontSize: 12, fontWeight: '700', color: colors.amberText },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12,
  },
  modeIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  modeTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  modeSubtitle: { fontSize: 12.5, color: colors.textMuted, marginTop: 2 },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.5 },
  loader: { marginTop: 12 },
  timer: { fontSize: 20, fontWeight: '800', color: colors.text, minWidth: 48, textAlign: 'right' },
  timerUrgent: { color: colors.danger },
  comboChip: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: colors.orangeBg, borderRadius: 12, paddingHorizontal: 9, paddingVertical: 4 },
  comboText: { fontSize: 13, fontWeight: '800', color: colors.orangeText },
  barTrack: { height: 8, borderRadius: 4, backgroundColor: colors.border, overflow: 'hidden', marginBottom: 12 },
  barFill: { height: 8, borderRadius: 4, backgroundColor: colors.primary },
  barUrgent: { backgroundColor: colors.danger },
  scoreLine: { fontSize: 13, fontWeight: '600', color: colors.textMuted, marginBottom: 10 },
  label: { fontSize: 13, color: colors.textMuted, marginBottom: 6 },
  prompt: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 18 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: 10,
  },
  optionRight: { borderColor: colors.secondary, backgroundColor: `${colors.secondary}14` },
  optionWrong: { borderColor: colors.danger, backgroundColor: `${colors.danger}14` },
  optionText: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.text },
  resultCard: { alignItems: 'center', marginBottom: 16, paddingVertical: 24 },
  trophy: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  score: { fontSize: 52, fontWeight: '800', color: colors.text },
  resultText: { fontSize: 14, color: colors.textMuted, marginTop: 2, textAlign: 'center' },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 18, alignSelf: 'stretch' },
  statBox: { flex: 1, backgroundColor: colors.background, borderRadius: 14, padding: 12, alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: 11.5, color: colors.textMuted, marginTop: 2, textAlign: 'center' },
  bestLine: { fontSize: 13, color: colors.textMuted, marginTop: 14 },
  gap: { marginTop: 10 },
}));
