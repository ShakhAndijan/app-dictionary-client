import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, themed } from '../../theme/colors';
import { speakEnglish } from '../../services/speech';
import { CheckResult, ItemKind } from '../../api/learnApi';

export interface ExerciseData {
  id: string;
  kind: ItemKind;
  prompt: string;
  options: string[] | null;
  words: string[] | null;
  passage?: string | null;
  audioText?: string | null;
}

interface Props {
  item: ExerciseData;
  last: boolean;
  /** Check the answer right away (lessons). Without it the answer is simply accepted (exam). */
  instant?: (answer: string) => Promise<CheckResult>;
  onDone: (answer: string) => void;
}

const HEADING: Record<ItemKind, string> = {
  CHOICE: "To'g'ri variantni tanlang",
  FILL: 'Javobni yozing',
  ORDER: 'Gapni to\'g\'ri tartibga soling',
  SPEAK: 'Ovoz chiqarib ayting',
};

/** Reading text and listening audio shown above the question. */
export function Context({ passage, audioText }: { passage?: string | null; audioText?: string | null }) {
  if (!passage && !audioText) return null;
  return (
    <View style={styles.context}>
      {audioText ? (
        <View style={styles.audioRow}>
          <Pressable style={styles.audioBtn} onPress={() => speakEnglish(audioText)} onLongPress={() => speakEnglish(audioText, true)}>
            <Ionicons name="volume-high" size={22} color="#fff" />
            <Text style={styles.audioBtnText}>Tinglash</Text>
          </Pressable>
          <Text style={styles.audioHint}>Uzoq bosing: sekinroq</Text>
        </View>
      ) : null}
      {passage ? (
        <ScrollView style={styles.passageBox} nestedScrollEnabled>
          <Text style={styles.passage}>{passage}</Text>
        </ScrollView>
      ) : null}
    </View>
  );
}

export default function ExerciseView({ item, last, instant, onDone }: Props) {
  const [value, setValue] = useState('');
  const [picked, setPicked] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<CheckResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setValue('');
    setPicked([]);
    setFeedback(null);
    setError('');
  }, [item.id]);

  const answer =
    item.kind === 'ORDER' ? picked.map((i) => item.words![i]).join(' ') : item.kind === 'SPEAK' ? value : value.trim();
  const locked = !!feedback;

  const submit = async () => {
    if (!answer || busy || locked) return;
    if (!instant) {
      onDone(answer);
      return;
    }
    setBusy(true);
    setError('');
    try {
      setFeedback(await instant(answer));
    } catch {
      setError("Tekshirib bo'lmadi. Aloqani tekshirib, qayta urinib ko'ring.");
    } finally {
      setBusy(false);
    }
  };

  const parts = item.kind === 'CHOICE' || item.kind === 'FILL' ? item.prompt.split('___') : null;
  const hasBlank = !!parts && parts.length > 1;

  return (
    <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
      <Context passage={item.passage} audioText={item.audioText} />
      <Text style={styles.tag}>{item.kind === 'FILL' && hasBlank ? "Bo'sh joyni to'ldiring" : HEADING[item.kind]}</Text>

      {item.kind === 'ORDER' ? (
        <Text style={styles.promptSmall}>Quyidagi so'zlardan gap tuzing</Text>
      ) : hasBlank ? (
        <Text style={styles.prompt}>
          {parts!.map((p, i) => (
            <Text key={i}>
              {p}
              {i < parts!.length - 1 ? <Text style={styles.slot}>{value ? ` ${value} ` : ' ____ '}</Text> : null}
            </Text>
          ))}
        </Text>
      ) : (
        <Text style={styles.prompt}>{item.prompt}</Text>
      )}

      {item.kind === 'CHOICE' &&
        item.options!.map((opt) => {
          const right = locked && opt.toLowerCase() === feedback!.answer.toLowerCase();
          const wrong = locked && !feedback!.correct && opt === value;
          return (
            <Pressable
              key={opt}
              disabled={locked}
              onPress={() => setValue(opt)}
              style={[styles.opt, value === opt && !locked && styles.optSel, right && styles.optRight, wrong && styles.optWrong]}
            >
              <Text style={styles.optText}>{opt}</Text>
            </Pressable>
          );
        })}

      {item.kind === 'FILL' && (
        <TextInput
          style={[styles.input, locked && (feedback!.correct ? styles.optRight : styles.optWrong)]}
          value={value}
          editable={!locked}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Javobni yozing…"
          placeholderTextColor={colors.textMuted}
          onChangeText={setValue}
          onSubmitEditing={submit}
          returnKeyType="done"
        />
      )}

      {item.kind === 'SPEAK' && (
        <View style={styles.speakBox}>
          <Pressable style={styles.audioBtn} onPress={() => speakEnglish(item.prompt)} onLongPress={() => speakEnglish(item.prompt, true)}>
            <Ionicons name="volume-high" size={22} color="#fff" />
            <Text style={styles.audioBtnText}>Namunani eshiting</Text>
          </Pressable>
          <Text style={styles.speakHint}>Jumlani ovoz chiqarib ayting, so'ng quyidagi tugmani bosing.</Text>
          {!locked && (
            <Pressable style={[styles.opt, value ? styles.optSel : null]} onPress={() => setValue(item.prompt)}>
              <Text style={styles.optText}>{value ? '✓ Ayttim' : 'Ayttim'}</Text>
            </Pressable>
          )}
        </View>
      )}

      {item.kind === 'ORDER' && (
        <>
          <View style={[styles.line, locked && (feedback!.correct ? styles.optRight : styles.optWrong)]}>
            {picked.length === 0 && <Text style={styles.lineHint}>So'zlarni bosib gap tuzing</Text>}
            {picked.map((wi, pos) => (
              <Pressable key={pos} disabled={locked} style={styles.chip} onPress={() => setPicked(picked.filter((_, p) => p !== pos))}>
                <Text style={styles.chipText}>{item.words![wi]}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.bank}>
            {item.words!.map((w, i) => (
              <Pressable
                key={i}
                disabled={locked || picked.includes(i)}
                style={[styles.chip, picked.includes(i) && styles.chipUsed]}
                onPress={() => setPicked([...picked, i])}
              >
                <Text style={styles.chipText}>{w}</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {feedback ? (
        <View style={[styles.bar, feedback.correct ? styles.barGood : styles.barBad]}>
          <Text style={styles.barTitle}>{feedback.correct ? "To'g'ri!" : "Noto'g'ri"}</Text>
          {!feedback.correct && <Text style={styles.barText}>To'g'ri javob: {feedback.answer}</Text>}
          {feedback.explain ? <Text style={styles.barText}>{feedback.explain}</Text> : null}
          <Pressable style={styles.go} onPress={() => onDone(answer)}>
            <Text style={styles.goText}>{last ? 'Natija' : 'Davom etish'} →</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable style={[styles.go, (!answer || busy) && styles.goOff]} disabled={!answer || busy} onPress={submit}>
          <Text style={styles.goText}>{busy ? '…' : instant ? 'Tekshirish' : last ? 'Tugatish' : 'Keyingi'}</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = themed(() =>
  StyleSheet.create({
    wrap: { padding: 20, paddingBottom: 40, gap: 12 },
    context: { gap: 10 },
    audioRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    audioBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16, alignSelf: 'flex-start' },
    audioBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
    audioHint: { color: colors.textMuted, fontSize: 12 },
    passageBox: { maxHeight: 260, backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 14 },
    passage: { color: colors.text, fontSize: 16, lineHeight: 25 },
    tag: { color: colors.primary, fontWeight: '700', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
    prompt: { color: colors.text, fontSize: 21, fontWeight: '700', lineHeight: 30 },
    promptSmall: { color: colors.textMuted, fontSize: 16 },
    slot: { color: colors.primary, fontWeight: '800' },
    opt: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, paddingVertical: 14, paddingHorizontal: 16 },
    optSel: { borderColor: colors.primary, backgroundColor: `${colors.primary}14` },
    optRight: { borderColor: colors.secondary, backgroundColor: colors.greenBg },
    optWrong: { borderColor: colors.danger, backgroundColor: '#EF444418' },
    optText: { color: colors.text, fontSize: 16 },
    input: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, paddingVertical: 14, paddingHorizontal: 16, color: colors.text, fontSize: 17 },
    speakBox: { gap: 12 },
    speakHint: { color: colors.textMuted, fontSize: 14 },
    line: { minHeight: 56, flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 10, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center' },
    lineHint: { color: colors.textMuted },
    bank: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { backgroundColor: colors.indigoBg, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12 },
    chipUsed: { opacity: 0.3 },
    chipText: { color: colors.indigoText, fontSize: 16, fontWeight: '600' },
    error: { color: colors.danger },
    bar: { borderRadius: 14, padding: 14, gap: 6 },
    barGood: { backgroundColor: colors.greenBg },
    barBad: { backgroundColor: '#EF444418' },
    barTitle: { color: colors.text, fontWeight: '800', fontSize: 17 },
    barText: { color: colors.text, fontSize: 14 },
    go: { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
    goOff: { opacity: 0.45 },
    goText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  }),
);
