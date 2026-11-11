import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, themed } from '../../theme/colors';
import { Skill } from '../../api/learnApi';

export type IconName = keyof typeof Ionicons.glyphMap;
/** One drawn icon per skill, same family and weight everywhere in the course. */
export const SKILL_ICON: Record<Skill, IconName> = {
  READING: 'book',
  LISTENING: 'headset',
  SPEAKING: 'mic',
  WRITING: 'create',
  GRAMMAR: 'extension-puzzle',
};

const TOPIC_ICONS: [RegExp, IconName][] = [
  [/family|oila/i, 'people'], [/pet\b|zoo|animal/i, 'paw'], [/teacher|school|maktab|library/i, 'school'], [/sport|football|volley/i, 'football'],
  [/birthday|party/i, 'gift'], [/doctor|pharmacy|nurse|health/i, 'medkit'], [/letter|email|message/i, 'mail'], [/phone|call/i, 'call'],
  [/clothes|shopping|shop|market/i, 'bag-handle'], [/food|café|cafe|lunch|cook|restaurant|dinner|breakfast/i, 'restaurant'],
  [/work|job|office/i, 'briefcase'], [/transport|station|airport|bus|train/i, 'bus'], [/mountain|trip|holiday|beach|travel|hotel/i, 'airplane'],
  [/morning|routine|weekend|busy|day\b/i, 'sunny'], [/room|home|house/i, 'home'], [/book|reading/i, 'book'], [/tashkent|town|city|direction/i, 'business'],
  [/season|weather|forecast/i, 'partly-sunny'], [/colour|color/i, 'color-palette'], [/neighbour|friend/i, 'happy'], [/new year|picnic|park/i, 'leaf'],
  [/hobb|interview/i, 'game-controller'], [/greeting|introduc|about me|salom/i, 'hand-left'], [/time|date/i, 'time'], [/question|savol|who|what/i, 'help-circle'],
  [/yesterday|past|was|were|did/i, 'arrow-undo'], [/going to|plan/i, 'map'], [/can|could/i, 'barbell'], [/would like/i, 'heart'], [/to be/i, 'cube'],
  [/continuous/i, 'sync'], [/simple/i, 'calendar'], [/have/i, 'hand-right'], [/countable/i, 'calculator'], [/there is|there are/i, 'location'],
];
const SKILL_FALLBACK: Record<Skill, IconName[]> = {
  READING: ['newspaper', 'book', 'document-text', 'bookmark', 'library', 'reader'],
  LISTENING: ['headset', 'volume-high', 'musical-notes', 'radio', 'mic-circle', 'ear'],
  SPEAKING: ['chatbubbles', 'mic', 'megaphone', 'chatbubble-ellipses', 'people-circle', 'recording'],
  WRITING: ['create', 'pencil', 'document', 'journal', 'brush', 'clipboard'],
  GRAMMAR: ['extension-puzzle', 'construct', 'bulb', 'git-branch', 'text', 'shapes'],
};

/** An icon for a lesson: by what it is about, otherwise rotating through a set that belongs to its skill. */
export function lessonIcon(l: { skill: Skill; topic: string; title: string }): IconName {
  const first = l.skill === 'GRAMMAR' ? l.topic : l.topic.split(',')[0];
  const hit = TOPIC_ICONS.find(([re]) => re.test(first));
  if (hit) return hit[1];
  const n = parseInt(l.title.replace(/\D+/g, ''), 10) || 1;
  const set = SKILL_FALLBACK[l.skill];
  return set[(n - 1) % set.length];
}

/** The pass mark of a lesson (kept in step with the server). */
export const PASS_MARK = 70;

/** A tinted circle holding an icon. */
export function IconBadge({ name, tone, size = 44 }: { name: IconName; tone: string; size?: number }) {
  return (
    <View style={[styles.badge, { width: size, height: size, borderRadius: size / 2, backgroundColor: `${tone}22` }]}>
      <Ionicons name={name} size={Math.round(size * 0.48)} color={tone} />
    </View>
  );
}

/** A thin rounded progress bar. `mark` draws a tick at a percentage (the pass mark). */
export function Bar({ pct, tone = colors.primary, height = 6, mark, style }: { pct: number; tone?: string; height?: number; mark?: number; style?: ViewStyle }) {
  const p = Math.max(0, Math.min(100, pct));
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }, style]}>
      <View style={{ width: `${p}%`, height, borderRadius: height / 2, backgroundColor: tone }} />
      {mark !== undefined && <View style={[styles.mark, { left: `${mark}%`, height: height + 6, top: -3 }]} />}
    </View>
  );
}

export function SectionTitle({ children, right }: { children: string; right?: React.ReactNode }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.section}>{children}</Text>
      {right}
    </View>
  );
}

/** Shared surface for the course screens: flat, hairline border, no drop shadow. */
export const courseStyles = themed(() =>
  StyleSheet.create({
    surface: { backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.border },
    rowDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  }),
);

const styles = themed(() =>
  StyleSheet.create({
    badge: { alignItems: 'center', justifyContent: 'center' },
    track: { backgroundColor: colors.border, overflow: 'visible' },
    mark: { position: 'absolute', width: 2, backgroundColor: colors.textMuted, opacity: 0.6, borderRadius: 1 },
    sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 28, marginBottom: 12 },
    section: { color: colors.text, fontSize: 18, fontWeight: '800', letterSpacing: -0.2 },
  }),
);
