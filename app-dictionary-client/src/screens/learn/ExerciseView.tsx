import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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
  ORDER: "Gapni to'g'ri tartibga soling",
  SPEAK: 'Ovoz chiqarib ayting',
};

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/** Reading text and listening audio shown above the question. */
export function Context({ passage, audioText }: { passage?: string | null; audioText?: string | null }) {
  if (!passage && !audioText) return null;
  return (
    <View style={styles.context}>
      {audioText ? (
        <View style={styles.audioRow}>
          <Pressable style={({ pressed }) => [styles.play, pressed && { opacity: 0.85 }]} onPress={() => speakEnglish(audioText)} onLongPress={() => speakEnglish(audioText, true)} accessibilityLabel="Tinglash">
            <Ionicons name="play" size={24} color="#fff" style={{ marginLeft: 3 }} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.audioTitle}>Tinglash</Text>
            <Text style={styles.audioHint}>Bosing. Uzoq bosib tursangiz, sekinroq o'qiladi.</Text>
          </View>
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
  const slotColor = locked ? (feedback!.correct ? colors.secondary : colors.danger) : colors.primary;

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
        <Context passage={item.passage} audioText={item.audioText} />
        <Text style={styles.tag}>{item.kind === 'FILL' && hasBlank ? "Bo'sh joyni to'ldiring" : HEADING[item.kind]}</Text>

        {item.kind === 'ORDER' ? (
          <Text style={styles.promptSmall}>Quyidagi so'zlardan gap tuzing</Text>
        ) : item.kind === 'SPEAK' ? null : hasBlank ? (
          <Text style={styles.prompt}>
            {parts!.map((p, i) => (
              <Text key={i}>
                {p}
                {i < parts!.length - 1 ? <Text style={[styles.slot, { color: slotColor }]}>{value ? ` ${value} ` : ' ____ '}</Text> : null}
              </Text>
            ))}
          </Text>
        ) : (
          <Text style={styles.prompt}>{item.prompt}</Text>
        )}

        {item.kind === 'CHOICE' &&
          item.options!.map((opt, i) => {
            const right = locked && opt.toLowerCase() === feedback!.answer.toLowerCase();
            const wrong = locked && !feedback!.correct && opt === value;
            const sel = value === opt && !locked;
            return (
              <Pressable
                key={opt}
                disabled={locked}
                onPress={() => setValue(opt)}
                style={[styles.opt, sel && styles.optSel, right && styles.optRight, wrong && styles.optWrong]}
              >
                <View style={[styles.letter, sel && { backgroundColor: colors.primary }, right && { backgroundColor: colors.secondary }, wrong && { backgroundColor: colors.danger }]}>
                  {right ? (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  ) : wrong ? (
                    <Ionicons name="close" size={16} color="#fff" />
                  ) : (
                    <Text style={[styles.letterText, sel && { color: '#fff' }]}>{LETTERS[i] ?? i + 1}</Text>
                  )}
                </View>
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
            <Text style={styles.speakPhrase}>{item.prompt}</Text>
            <Pressable style={({ pressed }) => [styles.listen, pressed && { opacity: 0.8 }]} onPress={() => speakEnglish(item.prompt)} onLongPress={() => speakEnglish(item.prompt, true)}>
              <Ionicons name="volume-high" size={20} color={colors.primary} />
              <Text style={styles.listenText}>Namunani eshiting</Text>
            </Pressable>
            <Text style={styles.speakHint}>Jumlani ovoz chiqarib ayting, so'ng tasdiqlang.</Text>
            {!locked && (
              <Pressable style={({ pressed }) => [styles.said, value && styles.saidOn, pressed && { opacity: 0.85 }]} onPress={() => setValue(value ? '' : item.prompt)}>
                <Ionicons name={value ? 'checkmark-circle' : 'mic'} size={22} color={value ? '#fff' : colors.primary} />
                <Text style={[styles.saidText, value && { color: '#fff' }]}>{value ? 'Aytdim' : 'Aytdim, tasdiqlash'}</Text>
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
      </ScrollView>

      {feedback ? (
        <View style={[styles.dock, feedback.correct ? styles.dockGood : styles.dockBad]}>
          <View style={styles.dockHead}>
            <Ionicons name={feedback.correct ? 'checkmark-circle' : 'close-circle'} size={26} color={feedback.correct ? colors.secondary : colors.danger} />
            <Text style={[styles.dockTitle, { color: feedback.correct ? colors.greenText : colors.danger }]}>{feedback.correct ? "To'g'ri!" : "Noto'g'ri"}</Text>
          </View>
          {!feedback.correct && <Text style={styles.dockText}>To'g'ri javob: {feedback.answer}</Text>}
          {feedback.explain ? <Text style={styles.dockText}>{feedback.explain}</Text> : null}
          <Pressable style={[styles.go, { backgroundColor: feedback.correct ? colors.secondary : colors.danger }]} onPress={() => onDone(answer)}>
            <Text style={styles.goText}>{last ? 'Natijani ko\'rish' : 'Davom etish'}</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.dock}>
          <Pressable style={[styles.go, (!answer || busy) && styles.goOff]} disabled={!answer || busy} onPress={submit}>
            <Text style={styles.goText}>{busy ? '…' : instant ? 'Tekshirish' : last ? 'Tugatish' : 'Keyingisi'}</Text>
          </Pressable>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = themed(() =>
  StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    wrap: { padding: 20, paddingBottom: 24, gap: 12 },
    context: { gap: 12, marginBottom: 6 },
    audioRow: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 14 },
    play: { width: 54, height: 54, borderRadius: 27, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
    audioTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
    audioHint: { color: colors.textMuted, fontSize: 13, marginTop: 2, lineHeight: 18 },
    passageBox: { maxHeight: 250, backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 16 },
    passage: { color: colors.text, fontSize: 16.5, lineHeight: 26 },
    tag: { color: colors.textMuted, fontWeight: '600', fontSize: 14 },
    prompt: { color: colors.text, fontSize: 24, fontWeight: '800', lineHeight: 33, letterSpacing: -0.3, marginBottom: 6 },
    promptSmall: { color: colors.text, fontSize: 20, fontWeight: '700', marginBottom: 6 },
    slot: { fontWeight: '800' },
    opt: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1.5, borderColor: colors.border, paddingVertical: 13, paddingHorizontal: 14 },
    optSel: { borderColor: colors.primary, backgroundColor: colors.indigoBg },
    optRight: { borderColor: colors.secondary, backgroundColor: colors.greenBg },
    optWrong: { borderColor: colors.danger, backgroundColor: '#EF444418' },
    letter: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
    letterText: { color: colors.textMuted, fontWeight: '800', fontSize: 13 },
    optText: { color: colors.text, fontSize: 17, flex: 1 },
    input: { backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1.5, borderColor: colors.border, paddingVertical: 15, paddingHorizontal: 16, color: colors.text, fontSize: 18 },
    speakBox: { gap: 16, alignItems: 'stretch' },
    speakPhrase: { color: colors.text, fontSize: 26, fontWeight: '800', lineHeight: 35, letterSpacing: -0.3 },
    listen: { flexDirection: 'row', alignItems: 'center', gap: 10, alignSelf: 'flex-start', backgroundColor: colors.indigoBg, borderRadius: 14, paddingVertical: 11, paddingHorizontal: 16 },
    listenText: { color: colors.indigoText, fontWeight: '700', fontSize: 15 },
    speakHint: { color: colors.textMuted, fontSize: 14, lineHeight: 20 },
    said: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 16, borderWidth: 1.5, borderColor: colors.primary, paddingVertical: 15 },
    saidOn: { backgroundColor: colors.primary },
    saidText: { color: colors.primary, fontSize: 16, fontWeight: '700' },
    line: { minHeight: 64, flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 10, borderRadius: 16, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center' },
    lineHint: { color: colors.textMuted, paddingHorizontal: 4 },
    bank: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
    chip: { backgroundColor: colors.indigoBg, borderRadius: 12, paddingVertical: 9, paddingHorizontal: 14 },
    chipUsed: { opacity: 0.28 },
    chipText: { color: colors.indigoText, fontSize: 17, fontWeight: '700' },
    error: { color: colors.danger },
    dock: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 18, gap: 8, backgroundColor: colors.background, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
    dockGood: { backgroundColor: colors.greenBg, borderTopColor: 'transparent' },
    dockBad: { backgroundColor: '#EF444418', borderTopColor: 'transparent' },
    dockHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    dockTitle: { fontWeight: '800', fontSize: 19 },
    dockText: { color: colors.text, fontSize: 15, lineHeight: 21 },
    go: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginTop: 2 },
    goOff: { opacity: 0.4 },
    goText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  }),
);
