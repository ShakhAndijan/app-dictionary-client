import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors } from '../../theme/colors';
import { MainTabParamList } from '../../navigation/types';
import { QuizPromptType, Word } from '../../types';
import * as wordsApi from '../../api/wordsApi';
import * as quizApi from '../../api/quizApi';
import { QuizMode, QuizProgress, QuizSummary } from '../../api/quizApi';
import { dayKey } from '../../utils/date';
import { extractErrorMessage } from '../../utils/errors';

type Props = BottomTabScreenProps<MainTabParamList, 'Baholash'>;
type Phase = 'idle' | 'active' | 'results';

const PROMPT_META: Record<QuizPromptType, { label: string; icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  english: { label: "Inglizcha so'z", icon: 'language-outline', color: colors.primary },
  uzbek: { label: "O'zbekcha tarjima", icon: 'globe-outline', color: colors.secondary },
  definition: { label: 'Definition', icon: 'book-outline', color: '#F59E0B' },
};

// The server never reveals which language it expects for a "definition" prompt until
// after scoring (it's chosen at random server-side), so the label can't be more specific.
function answerLabelFor(promptType: QuizPromptType): string {
  if (promptType === 'english') return "O'zbekcha tarjima";
  if (promptType === 'uzbek') return "Inglizcha so'z";
  return 'Inglizcha yoki o\'zbekcha javob';
}

interface ResultTier {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  title: string;
  message: string;
}

function resultTierFor(accuracy: number, totalAnswered: number): ResultTier {
  if (totalAnswered === 0) {
    return {
      icon: 'help-circle-outline',
      color: colors.textMuted,
      title: 'Yakunlandi',
      message: "Birorta ham savolga javob berilmadi.",
    };
  }
  if (accuracy >= 80) {
    return {
      icon: 'trophy',
      color: colors.secondary,
      title: "Ajoyib natija!",
      message: "So'zlarni juda yaxshi bilasiz, shu zayilda davom eting.",
    };
  }
  if (accuracy >= 50) {
    return {
      icon: 'thumbs-up',
      color: colors.primary,
      title: "Yaxshi natija!",
      message: "Yana biroz mashq qilsangiz, mukammal bo'ladi.",
    };
  }
  return {
    icon: 'refresh-circle',
    color: '#F59E0B',
    title: 'Yana mashq qiling',
    message: "So'zlarni takrorlab, bilimingizni mustahkamlang.",
  };
}

function modeLabel(m: QuizMode | null): string {
  return m === 'TODAY' ? "Bugungi so'zlar" : "Barcha so'zlar";
}

function formatDuration(startIso?: string, endIso?: string | null): string | null {
  if (!startIso || !endIso) return null;
  const ms = new Date(endIso).getTime() - new Date(startIso).getTime();
  if (!Number.isFinite(ms) || ms < 0) return null;
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes === 0 ? `${seconds} soniya` : `${minutes} daqiqa ${seconds} soniya`;
}

export default function QuizScreen({ navigation }: Props) {
  const [words, setWords] = useState<Word[]>([]);
  const [loadingWords, setLoadingWords] = useState(true);

  const [phase, setPhase] = useState<Phase>('idle');
  const [mode, setMode] = useState<QuizMode | null>(null);
  const [starting, setStarting] = useState(false);

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [question, setQuestion] = useState<{ promptType: QuizPromptType; promptText: string } | null>(null);
  const [progress, setProgress] = useState<QuizProgress | null>(null);

  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ correct: boolean; correctAnswer: string } | null>(null);
  const [pendingNext, setPendingNext] = useState<{ promptType: QuizPromptType; promptText: string } | null>(null);

  const [summary, setSummary] = useState<QuizSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const loadWords = useCallback(async () => {
    setLoadingWords(true);
    try {
      const data = await wordsApi.getWords();
      setWords(data);
    } catch {
      // Keep previously loaded words on failure
    } finally {
      setLoadingWords(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (phase === 'idle') loadWords();
    }, [loadWords, phase])
  );

  const todayKey = dayKey(new Date());
  const todayWords = words.filter((w) => dayKey(new Date(w.createdAt)) === todayKey);

  const startSession = async (selectedMode: QuizMode) => {
    setStarting(true);
    try {
      const q = await quizApi.startQuiz(selectedMode);
      setMode(selectedMode);
      setSessionId(q.sessionId);
      setQuestion({ promptType: q.promptType, promptText: q.promptText });
      setProgress(q.progress);
      setAnswer('');
      setResult(null);
      setPendingNext(null);
      setSummary(null);
      setPhase('active');
    } catch (e: any) {
      Alert.alert('Xatolik', extractErrorMessage(e, "Baholashni boshlab bo'lmadi"));
    } finally {
      setStarting(false);
    }
  };

  const handleSubmit = async () => {
    if (!sessionId || !answer.trim() || result || submitting) return;
    Keyboard.dismiss();
    setSubmitting(true);
    try {
      const res = await quizApi.submitQuizAnswer(sessionId, answer.trim());
      setProgress(res.progress);
      setResult({ correct: res.correct, correctAnswer: res.correctAnswer });
      setPendingNext(
        res.progress.finished || !res.nextPromptType || !res.nextPromptText
          ? null
          : { promptType: res.nextPromptType, promptText: res.nextPromptText }
      );
    } catch (e: any) {
      Alert.alert('Xatolik', extractErrorMessage(e, "Javobni yuborib bo'lmadi"));
    } finally {
      setSubmitting(false);
    }
  };

  const goToResults = async (sid: number) => {
    setLoadingSummary(true);
    try {
      const s = await quizApi.finishQuiz(sid);
      setSummary(s);
    } catch {
      // Fall back to the progress we already have locally
      setSummary(null);
    } finally {
      setLoadingSummary(false);
      setPhase('results');
    }
  };

  const goNext = () => {
    setPendingNext((next) => {
      if (!next) return next;
      setQuestion(next);
      setAnswer('');
      setResult(null);
      return null;
    });
  };

  const finishSession = () => {
    if (sessionId) goToResults(sessionId);
  };

  const abortSession = () => {
    if (sessionId) quizApi.finishQuiz(sessionId).catch(() => {});
    setPhase('idle');
    setSessionId(null);
    setMode(null);
  };

  const backToStart = () => {
    setPhase('idle');
    setSessionId(null);
    setMode(null);
    setSummary(null);
  };

  const restart = () => {
    if (mode) startSession(mode);
  };

  const correctCount = summary?.correctCount ?? progress?.correctCount ?? 0;
  const incorrectCount = summary?.incorrectCount ?? progress?.incorrectCount ?? 0;
  const totalAnswered = correctCount + incorrectCount;
  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
  const meta = question ? PROMPT_META[question.promptType] : null;
  const questionNumber = (progress?.answered ?? 0) + 1;

  if (loadingWords) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  if (phase === 'idle') {
    return (
      <ScreenContainer>
        <View style={styles.header}>
          <View style={styles.headerIconWrap}>
            <Ionicons name="checkmark-done-circle" size={26} color={colors.primary} />
          </View>
          <View style={styles.headerTextWrap}>
            <Text style={styles.title}>Baholash</Text>
            <Text style={styles.subtitle}>Bilimingizni sinab ko'ring va rivojlaning</Text>
          </View>
        </View>

        {words.length === 0 ? (
          <Card style={styles.emptyCard}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="file-tray-outline" size={30} color={colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>Savol topilmadi</Text>
            <Text style={styles.errorText}>So'z topilmadi. Avval so'z qo'shing.</Text>
            <Button
              title="So'z qo'shish"
              variant="outline"
              onPress={() => navigation.navigate('Sozlar')}
              style={styles.emptyBtn}
            />
          </Card>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Boshlash uchun tanlang</Text>
            <Text style={styles.sectionHint}>
              Savollar ketma-ket chiqadi, javobingiz darhol tekshiriladi va oxirida natijangizni ko'rasiz.
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.modeCard,
                starting && styles.modeCardDisabled,
                pressed && !starting && styles.modeCardPressed,
              ]}
              onPress={() => startSession('ALL')}
              disabled={starting}
            >
              <View style={[styles.modeIconWrap, { backgroundColor: `${colors.primary}1A` }]}>
                <Ionicons name="albums-outline" size={22} color={colors.primary} />
              </View>
              <View style={styles.modeTextWrap}>
                <Text style={styles.modeTitle}>Barcha so'zlar bilan</Text>
                <Text style={styles.modeSubtitle}>{words.length} ta so'z lug'atingizda</Text>
              </View>
              <View style={[styles.modeArrowWrap, { backgroundColor: `${colors.primary}1A` }]}>
                <Ionicons name="arrow-forward" size={16} color={colors.primary} />
              </View>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.modeCard,
                (starting || todayWords.length === 0) && styles.modeCardDisabled,
                pressed && !starting && todayWords.length > 0 && styles.modeCardPressed,
              ]}
              onPress={() => startSession('TODAY')}
              disabled={starting || todayWords.length === 0}
            >
              <View style={[styles.modeIconWrap, { backgroundColor: `${colors.secondary}1A` }]}>
                <Ionicons name="today-outline" size={22} color={colors.secondary} />
              </View>
              <View style={styles.modeTextWrap}>
                <Text style={styles.modeTitle}>Bugungi so'zlar bilan</Text>
                <Text style={styles.modeSubtitle}>
                  {todayWords.length > 0 ? `${todayWords.length} ta so'z bugun qo'shilgan` : 'Bugun so\'z qo\'shilmagan'}
                </Text>
              </View>
              <View style={[styles.modeArrowWrap, { backgroundColor: `${colors.secondary}1A` }]}>
                <Ionicons name="arrow-forward" size={16} color={colors.secondary} />
              </View>
            </Pressable>

            {starting && <ActivityIndicator color={colors.primary} style={styles.startingIndicator} />}
          </>
        )}
      </ScreenContainer>
    );
  }

  if (phase === 'results') {
    const tier = resultTierFor(accuracy, totalAnswered);
    const duration = formatDuration(summary?.startedAt, summary?.finishedAt);
    const resolvedMode = summary?.mode ?? mode;

    return (
      <ScreenContainer>
        {loadingSummary ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            <Card style={styles.resultsCard}>
              <View style={[styles.resultsIconWrap, { backgroundColor: `${tier.color}1A` }]}>
                <Ionicons name={tier.icon} size={32} color={tier.color} />
              </View>
              <Text style={styles.resultsAccuracy}>{accuracy}%</Text>
              <Text style={[styles.resultsTitle, { color: tier.color }]}>{tier.title}</Text>
              <Text style={styles.resultsMessage}>{tier.message}</Text>

              <View style={styles.accuracyTrack}>
                <View style={[styles.accuracyFill, { width: `${accuracy}%`, backgroundColor: tier.color }]} />
              </View>

              <View style={styles.statsRow}>
                <StatBlock icon="checkmark-circle" color={colors.secondary} value={correctCount} label="To'g'ri" />
                <View style={styles.statDivider} />
                <StatBlock icon="close-circle" color={colors.danger} value={incorrectCount} label="Xato" />
                <View style={styles.statDivider} />
                <StatBlock icon="list" color={colors.primary} value={totalAnswered} label="Jami" />
              </View>

              <View style={styles.resultsMetaRow}>
                <View style={styles.resultsMetaItem}>
                  <Ionicons
                    name={resolvedMode === 'TODAY' ? 'today-outline' : 'albums-outline'}
                    size={13}
                    color={colors.textMuted}
                  />
                  <Text style={styles.resultsMetaText}>{modeLabel(resolvedMode)}</Text>
                </View>
                {duration && (
                  <View style={styles.resultsMetaItem}>
                    <Ionicons name="time-outline" size={13} color={colors.textMuted} />
                    <Text style={styles.resultsMetaText}>{duration}</Text>
                  </View>
                )}
              </View>
            </Card>
            <Button title="Qayta boshlash" onPress={restart} style={styles.actionBtn} />
            <Button title="Orqaga" variant="outline" onPress={backToStart} style={styles.actionBtn} />
          </>
        )}
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.activeHeader}>
        <Pressable hitSlop={8} onPress={abortSession}>
          <Ionicons name="close" size={22} color={colors.textMuted} />
        </Pressable>
        <Text style={styles.activeProgress}>
          {progress && !progress.unlimited ? `${questionNumber} / ${progress.totalWords}` : `${questionNumber}-savol`}
        </Text>
        {progress?.unlimited ? (
          <Button
            title="Tugatish"
            variant="outline"
            onPress={finishSession}
            loading={loadingSummary}
            style={styles.finishBtn}
          />
        ) : (
          <View style={styles.finishBtnPlaceholder} />
        )}
      </View>

      <Card style={styles.statsCard}>
        <View style={styles.statsRow}>
          <StatBlock icon="checkmark-circle" color={colors.secondary} value={progress?.correctCount ?? 0} label="To'g'ri" />
          <View style={styles.statDivider} />
          <StatBlock icon="close-circle" color={colors.danger} value={progress?.incorrectCount ?? 0} label="Xato" />
          <View style={styles.statDivider} />
          <StatBlock icon="trending-up" color={colors.primary} value={`${accuracy}%`} label="Aniqlik" />
        </View>
      </Card>

      {question && meta && (
        <Card>
          <View style={[styles.promptBadge, { backgroundColor: `${meta.color}1A` }]}>
            <Ionicons name={meta.icon} size={14} color={meta.color} />
            <Text style={[styles.promptBadgeText, { color: meta.color }]}>{meta.label}</Text>
          </View>
          <Text style={styles.promptText}>{question.promptText}</Text>

          <Input
            label={answerLabelFor(question.promptType)}
            value={answer}
            onChangeText={setAnswer}
            editable={!result}
            placeholder="Javobingizni kiriting"
            autoCapitalize="none"
          />

          {result && (
            <View style={[styles.resultBanner, result.correct ? styles.resultCorrect : styles.resultIncorrect]}>
              <Ionicons
                name={result.correct ? 'checkmark-circle' : 'close-circle'}
                size={18}
                color={result.correct ? colors.secondary : colors.danger}
              />
              <Text style={[styles.resultText, result.correct ? styles.correct : styles.incorrect]}>
                {result.correct ? "To'g'ri javob!" : `Noto'g'ri. To'g'ri javob: ${result.correctAnswer}`}
              </Text>
            </View>
          )}

          {!result ? (
            <Button
              title="Tekshirish"
              onPress={handleSubmit}
              loading={submitting}
              disabled={!answer.trim()}
              style={styles.actionBtn}
            />
          ) : pendingNext ? (
            <Button title="Keyingisi" onPress={goNext} style={styles.actionBtn} />
          ) : (
            <Button
              title="Natijani ko'rish"
              onPress={finishSession}
              loading={loadingSummary}
              style={styles.actionBtn}
            />
          )}
        </Card>
      )}
    </ScreenContainer>
  );
}

function StatBlock({
  icon,
  color,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  value: number | string;
  label: string;
}) {
  return (
    <View style={styles.statBlock}>
      <Ionicons name={icon} size={16} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  headerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${colors.primary}1A`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: { flex: 1 },
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 4 },
  sectionHint: { fontSize: 12.5, color: colors.textMuted, lineHeight: 17, marginBottom: 16 },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  modeCardPressed: { opacity: 0.7 },
  modeCardDisabled: { opacity: 0.5 },
  modeIconWrap: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  modeTextWrap: { flex: 1 },
  modeTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  modeSubtitle: { fontSize: 12.5, color: colors.textMuted, marginTop: 2 },
  modeArrowWrap: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  startingIndicator: { marginTop: 8 },
  emptyCard: { alignItems: 'center', paddingVertical: 28 },
  emptyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 },
  emptyBtn: { marginTop: 16, alignSelf: 'stretch' },
  activeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  activeProgress: { fontSize: 14, fontWeight: '700', color: colors.text },
  finishBtn: { paddingHorizontal: 4, paddingVertical: 8 },
  finishBtnPlaceholder: { width: 22 },
  statsCard: { marginBottom: 16 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statDivider: { width: 1, height: 32, backgroundColor: colors.border },
  statBlock: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { fontSize: 17, fontWeight: '700', color: colors.text, marginTop: 2 },
  statLabel: { fontSize: 11, color: colors.textMuted },
  promptBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 14,
  },
  promptBadgeText: { fontSize: 12, fontWeight: '700' },
  promptText: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 20 },
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  resultCorrect: { backgroundColor: `${colors.secondary}1A` },
  resultIncorrect: { backgroundColor: `${colors.danger}1A` },
  resultText: { fontSize: 13, fontWeight: '600', flex: 1 },
  correct: { color: colors.secondary },
  incorrect: { color: colors.danger },
  errorText: { color: colors.textMuted, fontSize: 13, textAlign: 'center' },
  actionBtn: { marginTop: 8 },
  resultsCard: { alignItems: 'center', paddingVertical: 28, marginBottom: 16 },
  resultsIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  resultsAccuracy: { fontSize: 44, fontWeight: '800', color: colors.text },
  resultsTitle: { fontSize: 17, fontWeight: '700', marginTop: 4 },
  resultsMessage: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 12,
    lineHeight: 18,
  },
  accuracyTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginTop: 18,
    marginBottom: 22,
    overflow: 'hidden',
  },
  accuracyFill: { height: '100%', borderRadius: 3 },
  resultsMetaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    width: '100%',
  },
  resultsMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  resultsMetaText: { fontSize: 12, color: colors.textMuted, fontWeight: '500' },
});
