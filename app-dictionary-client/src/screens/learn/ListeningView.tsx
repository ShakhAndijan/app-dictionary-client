import React, { useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import Button from '../../components/Button';
import { colors, themed } from '../../theme/colors';
import * as learnApi from '../../api/learnApi';
import { CheckResult } from '../../api/learnApi';
import { ExerciseData } from './ExerciseView';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

function splitSentences(text: string): string[] {
  const parts = text.replace(/\s+/g, ' ').match(/[^.!?]+[.!?]+["')]*|[^.!?]+$/g);
  const list = (parts ?? [text]).map((s) => s.trim()).filter(Boolean);
  return list.length ? list : [text];
}

/** Consecutive items sharing one audio form a page; null when the lesson is not of that shape. */
export function listeningGroups(items: ExerciseData[]): ExerciseData[][] | null {
  if (items.length === 0) return null;
  if (items.some((i) => !i.audioText || (i.kind !== 'CHOICE' && i.kind !== 'FILL'))) return null;
  const groups: ExerciseData[][] = [];
  for (const it of items) {
    const g = groups[groups.length - 1];
    if (g && g[0].audioText === it.audioText) g.push(it);
    else groups.push([it]);
  }
  return groups;
}

/** Plays the text sentence by sentence so it can skip, seek and change speed. */
function AudioPlayer({ text }: { text: string }) {
  const sentences = useMemo(() => splitSentences(text), [text]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [width, setWidth] = useState(0);
  const token = useRef(0);

  const stop = () => {
    token.current += 1;
    Speech.stop().catch(() => undefined);
  };
  useEffect(() => stop, []);

  const playFrom = (start: number, r: number) => {
    stop();
    const t = token.current;
    setPlaying(true);
    const run = (k: number) => {
      if (t !== token.current) return;
      if (k >= sentences.length) {
        setPlaying(false);
        setIdx(0);
        return;
      }
      setIdx(k);
      Speech.speak(sentences[k], {
        language: 'en-US',
        rate: r,
        onDone: () => run(k + 1),
        onError: () => {
          if (t === token.current) setPlaying(false);
        },
      });
    };
    run(Math.max(0, Math.min(start, sentences.length - 1)));
  };

  const pause = () => {
    stop();
    setPlaying(false);
  };

  const seek = (to: number) => {
    const k = Math.max(0, Math.min(to, sentences.length - 1));
    if (playing) playFrom(k, rate);
    else setIdx(k);
  };

  const changeRate = (r: number) => {
    setRate(r);
    if (playing) playFrom(idx, r);
  };

  const pct = ((idx + (playing ? 0.5 : 0)) / sentences.length) * 100;

  return (
    <View style={styles.player}>
      <View style={styles.row}>
        <Pressable style={styles.skip} onPress={() => seek(idx - 1)} accessibilityLabel="Oldingi gap">
          <Ionicons name="play-skip-back" size={18} color={colors.text} />
        </Pressable>
        <Pressable style={styles.play} onPress={() => (playing ? pause() : playFrom(idx, rate))} accessibilityLabel={playing ? "To'xtatish" : 'Ijro etish'}>
          <Ionicons name={playing ? 'pause' : 'play'} size={24} color="#fff" style={playing ? undefined : { marginLeft: 3 }} />
        </Pressable>
        <Pressable style={styles.skip} onPress={() => seek(idx + 1)} accessibilityLabel="Keyingi gap">
          <Ionicons name="play-skip-forward" size={18} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, gap: 4 }}>
          <Pressable
            style={styles.trackHit}
            onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
            onPress={(e) => width > 0 && seek(Math.floor((e.nativeEvent.locationX / width) * sentences.length))}
          >
            <View style={styles.track}>
              <View style={[styles.trackFill, { width: `${pct}%` }]} />
            </View>
          </Pressable>
          <Text style={styles.count}>
            {idx + 1} / {sentences.length}
          </Text>
        </View>
      </View>
      <View style={styles.speeds}>
        {SPEEDS.map((s) => (
          <Pressable key={s} onPress={() => changeRate(s)} style={[styles.speed, rate === s && styles.speedOn]}>
            <Text style={[styles.speedText, rate === s && { color: '#fff' }]}>{s}×</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

interface Props {
  code: string;
  groups: ExerciseData[][];
  onFinish: (answers: { key: string; answer: string }[]) => void;
}

/** One audio and its ten questions at a time; check them all together, then move on. */
export default function ListeningView({ code, groups, onFinish }: Props) {
  const [gi, setGi] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, CheckResult> | null>(null);
  const [collected, setCollected] = useState<{ key: string; answer: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const scroll = useRef<React.ComponentRef<typeof ScrollView>>(null);

  const group = groups[gi];
  const last = gi + 1 === groups.length;
  const answered = group.filter((it) => (values[it.id] ?? '').trim()).length;
  const correct = feedback ? group.filter((it) => feedback[it.id]?.correct).length : 0;

  const check = async () => {
    if (busy || answered < group.length) return;
    setBusy(true);
    setError('');
    try {
      const res = await Promise.all(group.map((it) => learnApi.checkAnswer(code, it.id, values[it.id].trim())));
      const map: Record<string, CheckResult> = {};
      group.forEach((it, i) => {
        map[it.id] = res[i];
      });
      setFeedback(map);
    } catch {
      setError("Tekshirib bo'lmadi. Aloqani tekshirib, qayta urinib ko'ring.");
    } finally {
      setBusy(false);
    }
  };

  const next = () => {
    const all = [...collected, ...group.map((it) => ({ key: it.id, answer: values[it.id].trim() }))];
    if (last) return onFinish(all);
    setCollected(all);
    setFeedback(null);
    setGi(gi + 1);
    scroll.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.top}>
        <View style={styles.topRow}>
          <Text style={styles.topTitle}>Audio {gi + 1}</Text>
          <Text style={styles.topSub}>
            {gi + 1} / {groups.length} · {group.length} ta savol
          </Text>
        </View>
        <AudioPlayer key={gi} text={group[0].audioText!} />
      </View>

      <ScrollView ref={scroll} contentContainerStyle={styles.list} keyboardShouldPersistTaps="handled">
        {group.map((it, n) => {
          const fb = feedback?.[it.id];
          const v = values[it.id] ?? '';
          return (
            <View key={it.id} style={[styles.q, fb && { borderColor: fb.correct ? colors.secondary : colors.danger }]}>
              <View style={styles.qHead}>
                <View style={styles.num}>
                  <Text style={styles.numText}>{n + 1}</Text>
                </View>
                <Text style={styles.prompt}>{it.prompt.replace('___', v ? ` ${v} ` : ' ____ ')}</Text>
              </View>

              {it.kind === 'CHOICE' ? (
                it.options!.map((opt) => {
                  const right = !!fb && opt.toLowerCase() === fb.answer.toLowerCase();
                  const wrong = !!fb && !fb.correct && opt === v;
                  const sel = v === opt && !fb;
                  return (
                    <Pressable
                      key={opt}
                      disabled={!!fb}
                      onPress={() => setValues((p) => ({ ...p, [it.id]: opt }))}
                      style={[styles.opt, sel && styles.optSel, right && styles.optRight, wrong && styles.optWrong]}
                    >
                      <Text style={styles.optText}>{opt}</Text>
                    </Pressable>
                  );
                })
              ) : (
                <TextInput
                  style={[styles.input, fb && (fb.correct ? styles.optRight : styles.optWrong)]}
                  value={v}
                  editable={!fb}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Javobni yozing…"
                  placeholderTextColor={colors.textMuted}
                  onChangeText={(t) => setValues((p) => ({ ...p, [it.id]: t }))}
                />
              )}

              {fb ? (
                <View style={{ gap: 2 }}>
                  <Text style={[styles.fbTitle, { color: fb.correct ? colors.secondary : colors.danger }]}>{fb.correct ? "To'g'ri" : "Noto'g'ri"}</Text>
                  {!fb.correct ? <Text style={styles.fbText}>To'g'ri javob: {fb.answer}</Text> : null}
                  {fb.explain ? <Text style={styles.fbExplain}>{fb.explain}</Text> : null}
                </View>
              ) : null}
            </View>
          );
        })}
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>

      <View style={styles.footer}>
        {feedback ? (
          <>
            <Text style={styles.score}>
              {correct} / {group.length} to'g'ri
            </Text>
            <Button title={last ? 'Natija' : `Keyingi ${groups[gi + 1].length} ta`} onPress={next} />
          </>
        ) : (
          <>
            <Text style={styles.score}>
              {answered} / {group.length} belgilandi
            </Text>
            <Button title="Tekshirish" onPress={check} disabled={answered < group.length} loading={busy} />
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = themed(() =>
  StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    top: { padding: 14, paddingBottom: 10, gap: 8, backgroundColor: colors.background, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
    topTitle: { color: colors.text, fontWeight: '800', fontSize: 16 },
    topSub: { color: colors.textMuted, fontSize: 13 },
    player: { gap: 10 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    skip: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
    play: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
    trackHit: { paddingVertical: 10 },
    track: { height: 6, borderRadius: 3, backgroundColor: colors.border, overflow: 'hidden' },
    trackFill: { height: 6, borderRadius: 3, backgroundColor: colors.primary },
    count: { color: colors.textMuted, fontSize: 12, textAlign: 'right', fontVariant: ['tabular-nums'] },
    speeds: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
    speed: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
    speedOn: { backgroundColor: colors.primary, borderColor: colors.primary },
    speedText: { color: colors.textMuted, fontWeight: '800', fontSize: 13 },
    list: { padding: 14, gap: 12 },
    q: { backgroundColor: colors.surface, borderRadius: 16, borderWidth: 2, borderColor: colors.border, padding: 14, gap: 10 },
    qHead: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
    num: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.indigoBg },
    numText: { color: colors.indigoText, fontWeight: '800', fontSize: 13 },
    prompt: { flex: 1, color: colors.text, fontSize: 16, fontWeight: '700', lineHeight: 23 },
    opt: { paddingVertical: 11, paddingHorizontal: 14, borderRadius: 12, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.background },
    optSel: { borderColor: colors.primary, backgroundColor: colors.indigoBg },
    optRight: { borderColor: colors.secondary, backgroundColor: colors.greenBg },
    optWrong: { borderColor: colors.danger },
    optText: { color: colors.text, fontSize: 15, fontWeight: '600' },
    input: { borderWidth: 2, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 16, color: colors.text, backgroundColor: colors.background },
    fbTitle: { fontWeight: '800', fontSize: 14 },
    fbText: { color: colors.text, fontSize: 14 },
    fbExplain: { color: colors.textMuted, fontSize: 13, lineHeight: 18 },
    error: { color: colors.danger, textAlign: 'center' },
    footer: { padding: 14, gap: 8, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, backgroundColor: colors.background },
    score: { color: colors.textMuted, fontWeight: '700', textAlign: 'center' },
  }),
);
