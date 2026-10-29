import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import Button from '../../components/Button';
import WordImage from '../../components/WordImage';
import { colors } from '../../theme/colors';
import { ReviewSummary, Word } from '../../types';
import { QuizMode } from '../../api/quizApi';
import * as flashcardApi from '../../api/flashcardApi';
import { extractErrorMessage } from '../../utils/errors';
import { syncReminders } from '../../services/reminders';

interface Props {
  review: ReviewSummary | null;
  totalWords: number;
  onExit: () => void;
}

type Stage = 'choose' | 'play' | 'done';

interface DeckOption {
  mode: QuizMode;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  enabled: boolean;
}

const FLIP_MS = 350;

export default function FlashcardView({ review, totalWords, onExit }: Props) {
  const [stage, setStage] = useState<Stage>('choose');
  const [mode, setMode] = useState<QuizMode>('DUE');
  const [loading, setLoading] = useState(false);

  const [deck, setDeck] = useState<Word[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [englishFirst, setEnglishFirst] = useState(true);
  const [known, setKnown] = useState(0);
  const [missed, setMissed] = useState<Word[]>([]);
  // The retry round re-shows missed cards without writing to the schedule a second time.
  const [recording, setRecording] = useState(true);
  const [saving, setSaving] = useState(false);

  const flip = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    flip.setValue(flipped ? 1 : 0);
    // Only the user's tap should animate; resets (next card) jump back instantly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const toggleFlip = useCallback(() => {
    const next = !flipped;
    setFlipped(next);
    Animated.timing(flip, {
      toValue: next ? 1 : 0,
      duration: FLIP_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [flip, flipped]);

  const options: DeckOption[] = [
    {
      mode: 'DUE',
      title: 'Takrorlash',
      subtitle:
        (review?.dueCount ?? 0) + (review?.newCount ?? 0) > 0
          ? `${review?.dueCount ?? 0} ta takrorlash · ${review?.newCount ?? 0} ta yangi so'z`
          : "Bugun takrorlash uchun so'z yo'q",
      icon: 'repeat',
      color: colors.primary,
      enabled: (review?.dueCount ?? 0) + (review?.newCount ?? 0) > 0,
    },
    {
      mode: 'WEAK',
      title: "Zaif so'zlar",
      subtitle: (review?.weakCount ?? 0) > 0 ? `${review?.weakCount} ta so'z ko'p xato qilingan` : "Hozircha zaif so'z yo'q",
      icon: 'flash-outline',
      color: colors.danger,
      enabled: (review?.weakCount ?? 0) > 0,
    },
    {
      mode: 'ALL',
      title: "Tasodifiy so'zlar",
      subtitle: `Lug'atingizdan 20 tagacha so'z (${totalWords} ta ichidan)`,
      icon: 'shuffle-outline',
      color: colors.secondary,
      enabled: totalWords > 0,
    },
  ];

  const begin = async (selected: QuizMode) => {
    setLoading(true);
    try {
      const cards = await flashcardApi.getFlashcardDeck(selected);
      setMode(selected);
      startRound(cards, true);
    } catch (e: any) {
      Alert.alert('Xatolik', extractErrorMessage(e, "Kartalarni yuklab bo'lmadi"));
    } finally {
      setLoading(false);
    }
  };

  const startRound = (cards: Word[], record: boolean) => {
    setDeck(cards);
    setIndex(0);
    setFlipped(false);
    flip.setValue(0);
    setEnglishFirst(Math.random() < 0.5);
    setKnown(0);
    setMissed([]);
    setRecording(record);
    setStage('play');
  };

  const answer = async (knew: boolean) => {
    const card = deck[index];
    if (!card || saving) return;
    setSaving(true);
    if (recording) {
      try {
        await flashcardApi.answerFlashcard(card.id, knew);
      } catch (e: any) {
        setSaving(false);
        Alert.alert('Xatolik', extractErrorMessage(e, "Javobni saqlab bo'lmadi"));
        return;
      }
    }
    setSaving(false);
    if (knew) setKnown((k) => k + 1);
    else setMissed((m) => [...m, card]);

    if (index + 1 >= deck.length) {
      setStage('done');
      if (recording) syncReminders();
    } else {
      setFlipped(false);
      setEnglishFirst(Math.random() < 0.5);
      setIndex(index + 1);
    }
  };

  const spin = (outputRange: [string, string]) => flip.interpolate({ inputRange: [0, 1], outputRange });

  if (stage === 'choose') {
    return (
      <ScreenContainer>
        <View style={styles.topRow}>
          <Pressable onPress={onExit} hitSlop={10} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </Pressable>
          <Text style={styles.topTitle}>Fleshkart</Text>
        </View>
        <Text style={styles.hint}>
          Kartani bosib aylantiring, javobni ko'ring va bilganingizni belgilang. Javobingiz takrorlash jadvaliga ta'sir qiladi.
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
    const total = deck.length;
    const pct = total > 0 ? Math.round((known / total) * 100) : 0;
    return (
      <ScreenContainer>
        <Card style={styles.resultCard}>
          <View style={[styles.trophy, { backgroundColor: `${pct >= 50 ? colors.secondary : '#F59E0B'}1A` }]}>
            <Ionicons name={pct >= 50 ? 'trophy' : 'refresh-circle'} size={38} color={pct >= 50 ? colors.secondary : '#F59E0B'} />
          </View>
          <Text style={styles.percent}>{pct}%</Text>
          <Text style={styles.resultText}>
            {total} ta kartadan {known} tasini bildingiz
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: colors.secondary }]}>{known}</Text>
              <Text style={styles.statLabel}>Bildim</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: colors.danger }]}>{missed.length}</Text>
              <Text style={styles.statLabel}>Bilmadim</Text>
            </View>
          </View>
        </Card>
        {missed.length > 0 && (
          <Button title={`Bilmaganlarni takrorlash (${missed.length})`} onPress={() => startRound(missed, false)} />
        )}
        <Button
          title="Yangi to'plam"
          variant="outline"
          onPress={() => begin(mode)}
          loading={loading}
          style={styles.gap}
        />
        <Button title="Tugatish" variant="outline" onPress={onExit} style={styles.gap} />
      </ScreenContainer>
    );
  }

  const card = deck[index];
  const frontText = englishFirst ? card.english : card.uzbek;
  const backText = englishFirst ? card.uzbek : card.english;
  const frontBadge = englishFirst ? "Inglizcha so'z" : "O'zbekcha tarjima";
  const backBadge = englishFirst ? "O'zbekcha tarjima" : "Inglizcha so'z";
  const progressPct = (index / deck.length) * 100;

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <Pressable onPress={onExit} hitSlop={10} style={styles.iconBtn}>
          <Ionicons name="close" size={20} color={colors.text} />
        </Pressable>
        <Text style={styles.topTitle}>{recording ? 'Fleshkart' : 'Qayta urinish'}</Text>
        <Text style={styles.count}>
          {index + 1} / {deck.length}
        </Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${progressPct}%` }]} />
      </View>

      <Pressable onPress={toggleFlip} style={styles.cardArea} accessibilityRole="button" accessibilityLabel="Kartani aylantirish">
        <Animated.View
          style={[styles.face, { transform: [{ perspective: 1000 }, { rotateY: spin(['0deg', '180deg']) }] }]}
        >
          <View style={[styles.badge, englishFirst ? styles.badgeEn : styles.badgeUz]}>
            <Text style={[styles.badgeText, { color: englishFirst ? '#3730A3' : '#065F46' }]}>{frontBadge}</Text>
          </View>
          <Text style={styles.word}>{frontText}</Text>
          <WordImage wordId={card.id} version={card.imageVersion} style={styles.image} resizeMode="cover" />
          <View style={styles.tapHint}>
            <Ionicons name="sync-outline" size={14} color={colors.textMuted} />
            <Text style={styles.tapHintText}>Aylantirish uchun bosing</Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.face,
            styles.faceBack,
            { transform: [{ perspective: 1000 }, { rotateY: spin(['180deg', '360deg']) }] },
          ]}
          pointerEvents="none"
        >
          <ScrollView
            contentContainerStyle={styles.backContent}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          >
            <View style={[styles.badge, englishFirst ? styles.badgeUz : styles.badgeEn]}>
              <Text style={[styles.badgeText, { color: englishFirst ? '#065F46' : '#3730A3' }]}>{backBadge}</Text>
            </View>
            <Text style={styles.word}>{backText}</Text>
            {!!card.definition && (
              <View style={styles.definitionBox}>
                <Text style={styles.definitionLabel}>Definition</Text>
                <Text style={styles.definitionText}>{card.definition}</Text>
              </View>
            )}
            <WordImage wordId={card.id} version={card.imageVersion} style={styles.imageSmall} resizeMode="cover" />
          </ScrollView>
        </Animated.View>
      </Pressable>

      <View style={styles.actions}>
        {flipped ? (
          <>
            <Pressable
              style={({ pressed }) => [styles.actionBtn, styles.noBtn, pressed && styles.pressed, saving && styles.disabled]}
              onPress={() => answer(false)}
              disabled={saving}
              hitSlop={6}
            >
              <Ionicons name="close" size={20} color={colors.danger} />
              <Text style={[styles.actionText, { color: colors.danger }]}>Bilmadim</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.actionBtn, styles.yesBtn, pressed && styles.pressed, saving && styles.disabled]}
              onPress={() => answer(true)}
              disabled={saving}
              hitSlop={6}
            >
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={[styles.actionText, { color: '#fff' }]}>Bildim</Text>
            </Pressable>
          </>
        ) : (
          <Text style={styles.waitHint}>Avval javobni eslab ko'ring, keyin kartani aylantiring</Text>
        )}
      </View>

      <View style={styles.tally}>
        <Text style={styles.tallyText}>Bildim: {known}</Text>
        <Text style={styles.tallyText}>Bilmadim: {missed.length}</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
  cardArea: { height: 340 },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  faceBack: { padding: 0 },
  backContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  badge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12, marginBottom: 16 },
  badgeEn: { backgroundColor: '#EEF2FF' },
  badgeUz: { backgroundColor: '#D1FAE5' },
  badgeText: { fontSize: 12, fontWeight: '600' },
  word: { fontSize: 32, fontWeight: '700', color: colors.text, textAlign: 'center' },
  image: { width: 170, height: 120, borderRadius: 14, marginTop: 16 },
  imageSmall: { width: 140, height: 96, borderRadius: 12, marginTop: 14 },
  definitionBox: { marginTop: 14, alignSelf: 'stretch', backgroundColor: '#F59E0B14', borderRadius: 12, padding: 10 },
  definitionLabel: { fontSize: 11, fontWeight: '700', color: '#B45309', marginBottom: 2 },
  definitionText: { fontSize: 13.5, color: colors.text, lineHeight: 19 },
  tapHint: { position: 'absolute', bottom: 12, flexDirection: 'row', alignItems: 'center', gap: 6 },
  tapHintText: { fontSize: 12, color: colors.textMuted },
  actions: { flexDirection: 'row', gap: 12, marginTop: 18, minHeight: 56, alignItems: 'center' },
  actionBtn: { flex: 1, height: 54, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  noBtn: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.danger },
  yesBtn: { backgroundColor: colors.secondary },
  actionText: { fontSize: 15, fontWeight: '700' },
  waitHint: { flex: 1, textAlign: 'center', fontSize: 13, color: colors.textMuted },
  tally: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  tallyText: { fontSize: 12.5, color: colors.textMuted },
  resultCard: { alignItems: 'center', marginBottom: 16, paddingVertical: 24 },
  trophy: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  percent: { fontSize: 40, fontWeight: '800', color: colors.text },
  resultText: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 18, alignSelf: 'stretch' },
  statBox: { flex: 1, backgroundColor: colors.background, borderRadius: 14, padding: 12, alignItems: 'center' },
  statNum: { fontSize: 24, fontWeight: '800' },
  statLabel: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  gap: { marginTop: 10 },
});
