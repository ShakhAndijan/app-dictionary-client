import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { colors, themed } from '../../theme/colors';
import { courseStyles } from './learnUi';

export interface TheoryData {
  def: string;
  forms: [string, string, string][];
  rules: string[];
  ex: [string, string][];
  err?: [string, string, string][];
  /** When the structure is used: meaning and an English example. */
  uses?: [string, string][];
  /** Signal words that point to this structure. */
  signals?: string[];
  /** A short memory trick. */
  tip?: string;
}

/** Parses the lesson's explanation (JSON text from the server); null when absent or malformed. */
export function parseTheory(raw: string | null | undefined): TheoryData | null {
  if (!raw) return null;
  try {
    const t = JSON.parse(raw) as TheoryData;
    return t && typeof t.def === 'string' ? t : null;
  } catch {
    return null;
  }
}

const say = (text: string) => {
  Speech.stop();
  Speech.speak(text, { language: 'en-US', rate: 0.95 });
};

interface FormRow {
  kind: string;
  formula: string;
  example: string;
}

/** Consecutive rows labelled "Name — kind" share one card named "Name". */
function groupForms(forms: TheoryData['forms']) {
  const groups: { title: string; rows: FormRow[] }[] = [];
  for (const [label, formula, example] of forms) {
    const cut = label.indexOf(' — ');
    const title = cut < 0 ? label : label.slice(0, cut);
    const kind = cut < 0 ? '' : label.slice(cut + 3);
    const last = groups[groups.length - 1];
    if (last && last.title === title) last.rows.push({ kind, formula, example });
    else groups.push({ title, rows: [{ kind, formula, example }] });
  }
  return groups;
}

const SIGNS = [
  { mark: '(+)', sign: '+', color: '#16a34a' },
  { mark: '(−)', sign: '−', color: '#dc2626' },
  { mark: '(?)', sign: '?', color: '#d97706' },
];

function Kind({ kind }: { kind: string }) {
  if (!kind) return null;
  const found = SIGNS.find((s) => kind.includes(s.mark));
  return (
    <View style={styles.kindRow}>
      {found ? (
        <View style={[styles.sign, { backgroundColor: found.color }]}>
          <Text style={styles.signText}>{found.sign}</Text>
        </View>
      ) : null}
      <Text style={styles.kind}>{found ? kind.replace(found.mark, '').trim() : kind}</Text>
    </View>
  );
}

const SEPARATORS = /(\s\+\s|,\s|\s;\s|\s≠\s|\s↔\s|\s+yoki\s+)/;

/** "S + have + V3" as coloured blocks; a trailing "(word list)" goes on its own line. */
function Formula({ text }: { text: string }) {
  const hinted = /^(.*?)\s{2,}\((.*)\)$/.exec(text);
  const body = hinted ? hinted[1] : text;
  const parts = body.includes(' + ') ? body.split(SEPARATORS) : [body];
  return (
    <View style={styles.formula}>
      {parts.map((raw, i) => {
        const part = raw.trim();
        if (i % 2) {
          return (
            <Text key={i} style={styles.op}>
              {part}
            </Text>
          );
        }
        const subject = /^(S|boshqa S|ega)$/.test(part);
        const verb = /\b(V1|V2|V3|V-ing|Present|Past)\b/.test(part);
        return (
          <View key={i} style={[styles.chip, subject && styles.chipSubj, verb && styles.chipVerb]}>
            <Text style={[styles.chipText, subject && styles.chipSubjText, verb && styles.chipVerbText]}>{part}</Text>
          </View>
        );
      })}
      {hinted ? <Text style={styles.hint}>{hinted[2]}</Text> : null}
    </View>
  );
}

function Sample({ text }: { text: string }) {
  return (
    <Pressable onPress={() => say(text)} style={styles.sayRow}>
      <Ionicons name="volume-medium" size={18} color={colors.primary} />
      <Text style={styles.example}>{text}</Text>
    </Pressable>
  );
}

/** Grammar explanation shown before the exercises: definition, uses, formulas, signal words, rules, examples, mistakes. */
export default function TheoryView({ data }: { data: TheoryData }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.def}>
        <Text style={styles.eyebrow}>BU NIMA?</Text>
        <Text style={styles.defText}>{data.def}</Text>
      </View>

      {data.uses && data.uses.length > 0 ? (
        <>
          <Text style={styles.h}>🎯 Qachon ishlatiladi</Text>
          {data.uses.map(([meaning, example], i) => (
            <View key={meaning} style={[courseStyles.surface, styles.use]}>
              <View style={styles.num}>
                <Text style={styles.numText}>{i + 1}</Text>
              </View>
              <View style={styles.useBody}>
                <Text style={styles.meaning}>{meaning}</Text>
                <Sample text={example} />
              </View>
            </View>
          ))}
        </>
      ) : null}

      <Text style={styles.h}>📐 Formulalar</Text>
      {groupForms(data.forms).map((group) => (
        <View key={group.title + group.rows[0].formula} style={[courseStyles.surface, styles.form]}>
          <Text style={styles.label}>{group.title}</Text>
          {group.rows.map((row, i) => (
            <View key={row.kind + row.formula} style={[styles.row, i > 0 && styles.rowLine]}>
              <Kind kind={row.kind} />
              <Formula text={row.formula} />
              <Sample text={row.example} />
            </View>
          ))}
        </View>
      ))}

      {data.signals && data.signals.length > 0 ? (
        <>
          <Text style={styles.h}>🔎 Signal so'zlar</Text>
          <View style={styles.signals}>
            {data.signals.map((s) => (
              <View key={s} style={styles.signal}>
                <Text style={styles.signalText}>{s}</Text>
              </View>
            ))}
          </View>
        </>
      ) : null}

      {data.tip ? (
        <View style={styles.tip}>
          <Text style={styles.tipTitle}>💡 Eslab qoling</Text>
          <Text style={styles.tipText}>{data.tip}</Text>
        </View>
      ) : null}

      <Text style={styles.h}>📌 Qoidalar</Text>
      <View style={[courseStyles.surface, styles.rules]}>
        {data.rules.map((r) => (
          <View key={r} style={styles.ruleRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.ruleText}>{r}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.h}>💬 Hayotiy misollar</Text>
      {data.ex.map(([en, uz]) => (
        <Pressable key={en} onPress={() => say(en)} style={[courseStyles.surface, styles.sentence]}>
          <View style={styles.sayRow}>
            <Ionicons name="volume-medium" size={18} color={colors.primary} />
            <Text style={styles.en}>{en}</Text>
          </View>
          <Text style={styles.uz}>{uz}</Text>
        </Pressable>
      ))}

      {data.err && data.err.length > 0 ? (
        <>
          <Text style={styles.h}>⚠️ Ko'p uchraydigan xatolar</Text>
          {data.err.map(([wrong, right, note]) => (
            <View key={wrong} style={styles.err}>
              <Text style={styles.wrong}>✗ {wrong}</Text>
              <Text style={styles.right}>✓ {right}</Text>
              <Text style={styles.note}>{note}</Text>
            </View>
          ))}
        </>
      ) : null}
    </View>
  );
}

const styles = themed(() =>
  StyleSheet.create({
    wrap: { gap: 10 },
    def: { backgroundColor: colors.indigoBg, borderRadius: 14, padding: 14, gap: 4 },
    eyebrow: { color: colors.indigoText, fontSize: 11.5, fontWeight: '800', letterSpacing: 1, opacity: 0.75 },
    defText: { color: colors.indigoText, fontSize: 15.5, lineHeight: 23, fontWeight: '600' },
    h: { color: colors.text, fontSize: 17, fontWeight: '800', marginTop: 10 },
    use: { flexDirection: 'row', gap: 12, padding: 12 },
    num: { width: 26, height: 26, borderRadius: 8, backgroundColor: colors.indigoBg, alignItems: 'center', justifyContent: 'center' },
    numText: { color: colors.indigoText, fontSize: 13, fontWeight: '800' },
    useBody: { flex: 1, gap: 4 },
    meaning: { color: colors.text, fontSize: 14.5, lineHeight: 20, fontWeight: '700' },
    form: { padding: 14, gap: 8 },
    label: { color: colors.primary, fontSize: 14.5, fontWeight: '800' },
    row: { gap: 8 },
    rowLine: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.textMuted, paddingTop: 10 },
    kindRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    sign: { width: 20, height: 20, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
    signText: { color: '#fff', fontSize: 14, lineHeight: 18, fontWeight: '800' },
    kind: { color: colors.textMuted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
    formula: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
    chip: { backgroundColor: colors.background, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 6, maxWidth: '100%' },
    chipSubj: { backgroundColor: colors.indigoBg },
    chipVerb: { backgroundColor: colors.amberBg },
    chipText: { color: colors.text, fontSize: 14, fontWeight: '700', fontFamily: 'monospace' },
    chipSubjText: { color: colors.indigoText },
    chipVerbText: { color: colors.amberText },
    op: { color: colors.textMuted, fontSize: 14, fontWeight: '800' },
    hint: { width: '100%', color: colors.textMuted, fontSize: 13 },
    sayRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    example: { color: colors.text, fontSize: 14.5, fontStyle: 'italic', flex: 1, lineHeight: 20 },
    signals: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    signal: { backgroundColor: colors.indigoBg, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
    signalText: { color: colors.indigoText, fontSize: 13.5, fontWeight: '600' },
    tip: { backgroundColor: colors.amberBg, borderRadius: 14, padding: 14, gap: 4, marginTop: 6 },
    tipTitle: { color: colors.amberText, fontSize: 14.5, fontWeight: '800' },
    tipText: { color: colors.amberText, fontSize: 14.5, lineHeight: 21 },
    rules: { padding: 14, gap: 8 },
    ruleRow: { flexDirection: 'row', gap: 8 },
    bullet: { color: colors.primary, fontSize: 16, lineHeight: 22, fontWeight: '800' },
    ruleText: { color: colors.text, fontSize: 14.5, lineHeight: 22, flex: 1 },
    sentence: { padding: 12, gap: 3 },
    en: { color: colors.text, fontSize: 15, fontWeight: '700', flex: 1, lineHeight: 21 },
    uz: { color: colors.textMuted, fontSize: 13.5, marginLeft: 26 },
    err: { backgroundColor: colors.amberBg, borderRadius: 12, padding: 12, gap: 2 },
    wrong: { color: colors.danger, fontWeight: '700', fontSize: 14.5, textDecorationLine: 'line-through' },
    right: { color: colors.greenText, fontWeight: '700', fontSize: 14.5 },
    note: { color: colors.amberText, fontSize: 12.5, fontWeight: '600' },
  }),
);
