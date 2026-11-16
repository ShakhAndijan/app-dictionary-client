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

/** Grammar explanation shown before the exercises: definition, formulas, rules, real-life examples, common mistakes. */
export default function TheoryView({ data }: { data: TheoryData }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.def}>
        <Text style={styles.defText}>{data.def}</Text>
      </View>

      <Text style={styles.h}>📐 Formulalar</Text>
      {data.forms.map(([label, formula, example]) => (
        <View key={label + formula} style={[courseStyles.surface, styles.form]}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.formula}>
            <Text style={styles.formulaText}>{formula}</Text>
          </View>
          <Pressable onPress={() => say(example)} style={styles.sayRow}>
            <Ionicons name="volume-medium" size={18} color={colors.primary} />
            <Text style={styles.example}>{example}</Text>
          </Pressable>
        </View>
      ))}

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
    def: { backgroundColor: colors.indigoBg, borderRadius: 14, padding: 14 },
    defText: { color: colors.indigoText, fontSize: 15.5, lineHeight: 23, fontWeight: '600' },
    h: { color: colors.text, fontSize: 17, fontWeight: '800', marginTop: 10 },
    form: { padding: 14, gap: 8 },
    label: { color: colors.primary, fontSize: 12, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' },
    formula: { backgroundColor: colors.background, borderRadius: 10, padding: 10 },
    formulaText: { color: colors.text, fontSize: 15, fontWeight: '700', fontFamily: 'monospace' },
    sayRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    example: { color: colors.text, fontSize: 14.5, fontStyle: 'italic', flex: 1, lineHeight: 20 },
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
