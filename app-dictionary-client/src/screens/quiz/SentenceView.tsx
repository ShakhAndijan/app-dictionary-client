import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import SpeakButton from '../../components/SpeakButton';
import { colors, themed } from '../../theme/colors';
import { Word } from '../../types';
import * as sentencesApi from '../../api/sentencesApi';
import { SentenceResult } from '../../api/sentencesApi';
import { isNetworkError } from '../../utils/errors';
import { requestProgressCheck } from '../../services/progressEvents';

interface Props {
  words: Word[];
  remaining: number;
  onExit: () => void;
  title?: string;
  goal?: { done: number; target: number };
}

const MAX = 300;

function failure(e: any): string {
  if (isNetworkError(e)) return "Internet yo'q yoki server bilan aloqa uzildi. Qayta urinib ko'ring.";
  switch (e?.response?.status) {
    case 503:
      return "Sun'iy intellekt hozircha sozlanmagan.";
    case 429:
      return 'Bugungi tekshiruvlar limiti tugadi. Ertaga davom eting.';
    case 502:
      return "Sun'iy intellekt javob bermadi. Qayta urinib ko'ring, bu urinish hisoblanmadi.";
    default:
      return "Tekshirib bo'lmadi. Qayta urinib ko'ring.";
  }
}

function verdict(score: number): { label: string; tone: string; icon: keyof typeof Ionicons.glyphMap } {
  if (score >= 85) return { label: 'Ajoyib!', tone: '#10B981', icon: 'trophy' };
  if (score >= 65) return { label: 'Yaxshi', tone: '#6366F1', icon: 'thumbs-up' };
  if (score >= 40) return { label: "Yomon emas, tuzating", tone: '#F59E0B', icon: 'create' };
  return { label: "Qayta urinib ko'ring", tone: '#EF4444', icon: 'refresh' };
}

const norm = (t: string) => t.trim().replace(/\s+/g, ' ').toLowerCase();

export default function SentenceView({ words, remaining, onExit, title = 'Gap tuzish', goal }: Props) {
  const last = useRef<number | null>(null);
  const pick = (): Word => {
    const pool = words.length > 1 ? words.filter((w) => w.id !== last.current) : words;
    const w = pool[Math.floor(Math.random() * pool.length)];
    last.current = w.id;
    return w;
  };

  const [word, setWord] = useState<Word>(pick);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<SentenceResult | null>(null);
  const [left, setLeft] = useState(remaining);
  const [checked, setChecked] = useState(0);
  const [xp, setXp] = useState(0);

  const submit = async () => {
    const sentence = text.trim();
    if (!sentence || busy || result) return;
    setBusy(true);
    setError('');
    try {
      const r = await sentencesApi.checkSentence(word.id, sentence);
      setResult(r);
      setLeft(r.remainingToday);
      setChecked((n) => n + 1);
      setXp((n) => n + r.xpGained);
      requestProgressCheck();
    } catch (e) {
      setError(failure(e));
    } finally {
      setBusy(false);
    }
  };

  const next = () => {
    setWord(pick());
    setText('');
    setResult(null);
    setError('');
  };

  const v = result ? verdict(result.score) : null;
  const same = !!result && norm(result.corrected) === norm(text);
  const outOfChecks = left <= 0;

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <Pressable onPress={onExit} hitSlop={10} style={styles.iconBtn}>
          <Ionicons name="close" size={20} color={colors.text} />
        </Pressable>
        <View style={styles.flex}>
          <Text style={styles.topTitle}>{title}</Text>
          <Text style={styles.topSub}>
            {goal ? `Maqsad ${Math.min(goal.done + checked, goal.target)} / ${goal.target}` : `${checked} ta gap`}
            {xp > 0 ? ` · +${xp} XP` : ''} · {left} ta tekshiruv qoldi
          </Text>
        </View>
      </View>

      <Card>
        <Text style={styles.label}>Shu so'z bilan gap tuzing</Text>
        <View style={styles.wordRow}>
          <Text style={styles.word}>{word.english}</Text>
          <SpeakButton text={word.english} />
        </View>
        <Text style={styles.translation}>{word.uzbek}</Text>
        {!!word.definition && <Text style={styles.definition}>{word.definition}</Text>}

        {!result && (
          <>
            <Input
              value={text}
              onChangeText={setText}
              placeholder={`${word.english} so'zi bilan inglizcha gap yozing…`}
              multiline
              maxLength={MAX}
              editable={!busy}
              autoCapitalize="sentences"
              autoCorrect={false}
              style={styles.input}
            />
            <Text style={styles.count}>{text.length} / {MAX}</Text>
          </>
        )}

        {!!error && <Text style={styles.error}>{error}</Text>}

        {!result && (
          <>
            <Button title="Tekshirish" onPress={submit} loading={busy} disabled={!text.trim() || outOfChecks} />
            <Button title="Boshqa so'z" variant="outline" onPress={next} disabled={busy} style={styles.gap} />
            {outOfChecks && <Text style={styles.hint}>Bugungi tekshiruvlar tugadi. Ertaga davom eting.</Text>}
          </>
        )}

        {result && v && (
          <View style={[styles.result, { borderColor: `${v.tone}66` }]}>
            <View style={styles.scoreRow}>
              <View style={[styles.ring, { borderColor: v.tone }]}>
                <Text style={styles.ringText}>{result.score}</Text>
              </View>
              <View style={styles.flex}>
                <View style={styles.verdictRow}>
                  <Ionicons name={v.icon} size={18} color={v.tone} />
                  <Text style={styles.verdict}>{v.label}</Text>
                </View>
                <View style={styles.tags}>
                  <Text style={[styles.tag, result.usesWord ? styles.tagOk : styles.tagBad]}>
                    {result.usesWord ? "✓ So'z ishlatilgan" : "✕ So'z ishlatilmagan"}
                  </Text>
                  {result.xpGained > 0 && <Text style={[styles.tag, styles.tagXp]}>+{result.xpGained} XP</Text>}
                </View>
              </View>
            </View>

            {same ? (
              <View style={[styles.box, styles.boxFix]}>
                <Text style={styles.boxLabel}>✓ GAPINGIZ TO'G'RI</Text>
                <Text style={styles.boxText}>{text.trim()}</Text>
              </View>
            ) : (
              <>
                <View style={styles.box}>
                  <Text style={styles.boxLabel}>SIZNING GAPINGIZ</Text>
                  <Text style={styles.boxText}>{text.trim()}</Text>
                </View>
                <View style={[styles.box, styles.boxFix]}>
                  <Text style={styles.boxLabel}>TO'G'RI VARIANT</Text>
                  <Text style={styles.boxText}>{result.corrected}</Text>
                </View>
              </>
            )}

            {!!result.feedback && <Text style={styles.feedback}>💬 {result.feedback}</Text>}

            <Button title="Keyingi so'z" onPress={next} />
            <Button title="Qayta yozish" variant="outline" onPress={() => setResult(null)} style={styles.gap} />
          </View>
        )}
      </Card>
    </ScreenContainer>
  );
}

const styles = themed(() => StyleSheet.create({
  flex: { flex: 1 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  topTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  topSub: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  label: { fontSize: 13, color: colors.textMuted, marginBottom: 6 },
  wordRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  word: { fontSize: 28, fontWeight: '800', color: colors.text },
  translation: { fontSize: 16, fontWeight: '600', color: colors.textMuted, marginTop: 2 },
  definition: { fontSize: 13, color: colors.textMuted, fontStyle: 'italic', lineHeight: 19, marginTop: 8 },
  input: { minHeight: 90, textAlignVertical: 'top' },
  count: { alignSelf: 'flex-end', fontSize: 11.5, fontWeight: '700', color: colors.textMuted, marginBottom: 12 },
  error: { fontSize: 13, color: colors.danger, marginBottom: 10 },
  hint: { fontSize: 12.5, color: colors.textMuted, textAlign: 'center', marginTop: 10 },
  gap: { marginTop: 10 },
  result: { marginTop: 18, padding: 14, borderRadius: 18, borderWidth: 1, backgroundColor: colors.background },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  ring: { width: 64, height: 64, borderRadius: 32, borderWidth: 5, alignItems: 'center', justifyContent: 'center' },
  ringText: { fontSize: 20, fontWeight: '800', color: colors.text },
  verdictRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  verdict: { fontSize: 18, fontWeight: '800', color: colors.text },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  tag: { fontSize: 12, fontWeight: '800', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, overflow: 'hidden' },
  tagOk: { color: '#10B981', backgroundColor: '#10B9811F' },
  tagBad: { color: '#EF4444', backgroundColor: '#EF44441F' },
  tagXp: { color: '#FFFFFF', backgroundColor: '#10B981' },
  box: { padding: 12, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, marginBottom: 10 },
  boxFix: { borderColor: '#10B98173', backgroundColor: '#10B98114' },
  boxLabel: { fontSize: 10.5, fontWeight: '800', letterSpacing: 1, color: colors.textMuted, marginBottom: 4 },
  boxText: { fontSize: 15, fontWeight: '600', color: colors.text, lineHeight: 21 },
  feedback: { fontSize: 14, fontWeight: '600', color: colors.text, lineHeight: 21, marginBottom: 14, marginTop: 2 },
}));
