import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { colors, themed } from '../../theme/colors';
import { ReviewSummary, Word } from '../../types';
import { QuizMode } from '../../api/quizApi';
import * as flashcardApi from '../../api/flashcardApi';
import { extractErrorMessage } from '../../utils/errors';
import { syncReminders } from '../../services/reminders';
import { requestProgressCheck } from '../../services/progressEvents';
import { speakEnglish, stopSpeaking } from '../../services/speech';
import { buildDeckOptions } from './deckOptions';

interface Props {
  review: ReviewSummary | null;
  totalWords: number;
  favoriteCount?: number;
  onExit: () => void;
}

type Stage = 'choose' | 'play' | 'done';

const PAIRS_PER_ROUND = 5;
const MIN_WORDS = 3;
const WRONG_FLASH_MS = 650;
const ROUND_PAUSE_MS = 700;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Splits the deck into rounds of five pairs; a short tail is folded into the previous round. */
function toRounds(words: Word[]): Word[][] {
  const rounds: Word[][] = [];
  for (let i = 0; i < words.length; i += PAIRS_PER_ROUND) rounds.push(words.slice(i, i + PAIRS_PER_ROUND));
  if (rounds.length > 1 && rounds[rounds.length - 1].length < MIN_WORDS) {
    const tail = rounds.pop() as Word[];
    rounds[rounds.length - 1].push(...tail);
  }
  return rounds;
}

export default function MatchingView({ review, totalWords, favoriteCount = 0, onExit }: Props) {
  const [stage, setStage] = useState<Stage>('choose');
  const [loading, setLoading] = useState(false);

  const [rounds, setRounds] = useState<Word[][]>([]);
  const [roundIdx, setRoundIdx] = useState(0);
  const [left, setLeft] = useState<Word[]>([]);
  const [right, setRight] = useState<Word[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [selLeft, setSelLeft] = useState<number | null>(null);
  const [selRight, setSelRight] = useState<number | null>(null);
  const [wrong, setWrong] = useState<{ l: number; r: number } | null>(null);
  const [mistakes, setMistakes] = useState<number[]>([]);
  const [allWords, setAllWords] = useState<Word[]>([]);

  // Taps are ignored while a wrong pair flashes or the next round is loading.
  const locked = useRef(false);

  const options = buildDeckOptions(review, totalWords, favoriteCount);

  const setupRound = (words: Word[]) => {
    setLeft(shuffle(words));
    setRight(shuffle(words));
    setMatched([]);
    setSelLeft(null);
    setSelRight(null);
    setWrong(null);
    locked.current = false;
  };

  const begin = async (mode: QuizMode) => {
    setLoading(true);
    try {
      const deck = await flashcardApi.getFlashcardDeck(mode);
      if (deck.length < MIN_WORDS) {
        Alert.alert("Kam so'z", `Bu o'yin uchun kamida ${MIN_WORDS} ta so'z kerak.`);
        return;
      }
      const shuffled = shuffle(deck);
      const built = toRounds(shuffled);
      setRounds(built);
      setAllWords(shuffled);
      setMistakes([]);
      setRoundIdx(0);
      setupRound(built[0]);
      setStage('play');
    } catch (e: any) {
      Alert.alert('Xatolik', extractErrorMessage(e, "So'zlarni yuklab bo'lmadi"));
    } finally {
      setLoading(false);
    }
  };

  const finishRound = async (words: Word[], failed: number[]) => {
    locked.current = true;
    await Promise.all(
      words.map((w) =>
        flashcardApi.answerFlashcard(w.id, !failed.includes(w.id), 'MATCHING').catch((e: any) => {
          Alert.alert('Xatolik', extractErrorMessage(e, "Javobni saqlab bo'lmadi"));
        })
      )
    );
    setTimeout(() => {
      if (roundIdx + 1 >= rounds.length) {
        setStage('done');
        syncReminders();
        requestProgressCheck();
      } else {
        setRoundIdx(roundIdx + 1);
        setupRound(rounds[roundIdx + 1]);
      }
    }, ROUND_PAUSE_MS);
  };

  const resolve = (l: number, r: number) => {
    if (l === r) {
      const nextMatched = [...matched, l];
      setMatched(nextMatched);
      setSelLeft(null);
      setSelRight(null);
      if (nextMatched.length === rounds[roundIdx].length) {
        const roundIds = rounds[roundIdx].map((w) => w.id);
        finishRound(
          rounds[roundIdx],
          mistakes.filter((id) => roundIds.includes(id))
        );
      }
      return;
    }
    setMistakes(Array.from(new Set([...mistakes, l, r])));
    setWrong({ l, r });
    locked.current = true;
    setTimeout(() => {
      setWrong(null);
      setSelLeft(null);
      setSelRight(null);
      locked.current = false;
    }, WRONG_FLASH_MS);
  };

  const tapLeft = (word: Word) => {
    if (locked.current || matched.includes(word.id)) return;
    speakEnglish(word.english);
    setSelLeft(word.id);
    if (selRight !== null) resolve(word.id, selRight);
  };

  const tapRight = (word: Word) => {
    if (locked.current || matched.includes(word.id)) return;
    setSelRight(word.id);
    if (selLeft !== null) resolve(selLeft, word.id);
  };

  const leave = () => {
    stopSpeaking();
    onExit();
  };

  if (stage === 'choose') {
    return (
      <ScreenContainer>
        <View style={styles.topRow}>
          <Pressable onPress={leave} hitSlop={10} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </Pressable>
          <Text style={styles.topTitle}>Juftlarni moslash</Text>
        </View>
        <Text style={styles.hint}>
          Inglizcha so'zni uning tarjimasi bilan juftlang. Har turda 5 ta juft bor. Xatosiz moslangan so'z "bildim" hisoblanadi va
          takrorlash jadvaliga ta'sir qiladi (faqat 3-qutigacha).
        </Text>
        {options.map((o) => (
          <Pressable
            key={o.mode}
            style={({ pressed }) => [styles.modeCard, (!o.enabled || loading) && styles.disabled, pressed && styles.pressed]}
            disabled={!o.enabled || loading}
            onPress={() => begin(o.mode)}
          >
            <View style={[styles.modeIcon, { backgroundColor: `${o.color}1A` }]}>
              <Ionicons name={o.icon} size={22} color={o.color} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.modeTitle}>{o.title}</Text>
              <Text style={styles.modeSubtitle}>{o.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        ))}
        {loading && <ActivityIndicator color={colors.primary} style={styles.loader} />}
      </ScreenContainer>
    );
  }

  if (stage === 'done') {
    const total = allWords.length;
    const clean = total - mistakes.length;
    const pct = total > 0 ? Math.round((clean / total) * 100) : 0;
    const hard = allWords.filter((w) => mistakes.includes(w.id));
    return (
      <ScreenContainer>
        <Card style={styles.resultCard}>
          <View style={[styles.trophy, { backgroundColor: `${pct >= 50 ? colors.secondary : '#F59E0B'}1A` }]}>
            <Ionicons name={pct >= 50 ? 'trophy' : 'refresh-circle'} size={38} color={pct >= 50 ? colors.secondary : '#F59E0B'} />
          </View>
          <Text style={styles.percent}>{pct}%</Text>
          <Text style={styles.resultText}>
            {total} ta so'zdan {clean} tasini xatosiz moslashtirdingiz
          </Text>
        </Card>
        {hard.length > 0 && (
          <Card style={styles.hardCard}>
            <Text style={styles.hardTitle}>Qiynalgan so'zlaringiz</Text>
            {hard.map((w) => (
              <Text key={w.id} style={styles.hardRow}>
                {w.english} <Text style={styles.hardDash}>—</Text> {w.uzbek}
              </Text>
            ))}
          </Card>
        )}
        <Button title="Yangi to'plam" variant="outline" onPress={() => setStage('choose')} style={styles.gap} />
        <Button title="Tugatish" variant="outline" onPress={leave} style={styles.gap} />
      </ScreenContainer>
    );
  }

  const progressPct = (roundIdx / rounds.length) * 100;

  const tileState = (id: number, selected: number | null, side: 'l' | 'r') => {
    if (matched.includes(id)) return 'matched';
    if (wrong && wrong[side] === id) return 'wrong';
    if (selected === id) return 'selected';
    return 'idle';
  };

  const renderTile = (word: Word, side: 'l' | 'r') => {
    const state = tileState(word.id, side === 'l' ? selLeft : selRight, side);
    return (
      <Pressable
        key={`${side}-${word.id}`}
        onPress={() => (side === 'l' ? tapLeft(word) : tapRight(word))}
        disabled={state === 'matched'}
        style={[
          styles.tile,
          state === 'selected' && styles.tileSelected,
          state === 'matched' && styles.tileMatched,
          state === 'wrong' && styles.tileWrong,
        ]}
      >
        <Text style={[styles.tileText, state === 'matched' && styles.tileTextMatched]} numberOfLines={3}>
          {side === 'l' ? word.english : word.uzbek}
        </Text>
        {state === 'matched' && <Ionicons name="checkmark-circle" size={18} color={colors.secondary} />}
      </Pressable>
    );
  };

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <Pressable onPress={leave} hitSlop={10} style={styles.iconBtn}>
          <Ionicons name="close" size={20} color={colors.text} />
        </Pressable>
        <Text style={styles.topTitle}>Juftlarni moslash</Text>
        <Text style={styles.count}>
          {roundIdx + 1} / {rounds.length}
        </Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${progressPct}%` }]} />
      </View>

      <View style={styles.columns}>
        <View style={styles.column}>
          <Text style={styles.columnLabel}>Inglizcha</Text>
          {left.map((w) => renderTile(w, 'l'))}
        </View>
        <View style={styles.column}>
          <Text style={styles.columnLabel}>O'zbekcha</Text>
          {right.map((w) => renderTile(w, 'r'))}
        </View>
      </View>

      <Text style={styles.footer}>Inglizcha so'zni bossangiz o'qib beriladi</Text>
    </ScreenContainer>
  );
}

const styles = themed(() => StyleSheet.create({
  flex: { flex: 1 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  topTitle: { flex: 1, fontSize: 17, fontWeight: '700', color: colors.text },
  count: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  hint: { fontSize: 13, color: colors.textMuted, lineHeight: 19, marginBottom: 16 },
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
  barTrack: { height: 6, borderRadius: 3, backgroundColor: colors.border, overflow: 'hidden', marginBottom: 16 },
  barFill: { height: 6, borderRadius: 3, backgroundColor: colors.primary },
  columns: { flexDirection: 'row', gap: 12 },
  column: { flex: 1, gap: 10 },
  columnLabel: { fontSize: 12, fontWeight: '700', color: colors.textMuted, textAlign: 'center' },
  tile: {
    minHeight: 64,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tileSelected: { borderColor: colors.primary, backgroundColor: `${colors.primary}14` },
  tileMatched: { borderColor: colors.secondary, backgroundColor: `${colors.secondary}14` },
  tileWrong: { borderColor: colors.danger, backgroundColor: `${colors.danger}14` },
  tileText: { fontSize: 15, fontWeight: '600', color: colors.text, textAlign: 'center', flexShrink: 1 },
  tileTextMatched: { color: colors.textMuted },
  footer: { fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: 18 },
  resultCard: { alignItems: 'center', marginBottom: 16, paddingVertical: 24 },
  trophy: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  percent: { fontSize: 40, fontWeight: '800', color: colors.text },
  resultText: { fontSize: 14, color: colors.textMuted, marginTop: 2, textAlign: 'center' },
  hardCard: { marginBottom: 16 },
  hardTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 8 },
  hardRow: { fontSize: 14, color: colors.text, paddingVertical: 3 },
  hardDash: { color: colors.textMuted },
  gap: { marginTop: 10 },
}));
