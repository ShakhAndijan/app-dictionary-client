import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, themed } from '../../theme/colors';
import * as learnApi from '../../api/learnApi';
import { LessonSummary, SKILL_META } from '../../api/learnApi';
import { extractErrorMessage } from '../../utils/errors';
import { LearnStackParamList } from '../../navigation/types';
import { Bar, IconBadge, SKILL_ICON, lessonIcon } from './learnUi';

type Props = NativeStackScreenProps<LearnStackParamList, 'LearnLessons'>;

const ROW = 92;
const NODE = 52;
const TOP = 22;

/** The lessons of one skill as a winding road: finished ones behind, the next one waiting at the front. */
export default function LearnLessonsScreen({ route }: Props) {
  const { skill } = route.params;
  const meta = SKILL_META[skill];
  const nav = useNavigation<NativeStackNavigationProp<LearnStackParamList>>();
  const [lessons, setLessons] = useState<LessonSummary[] | null>(null);
  const [error, setError] = useState('');
  const [width, setWidth] = useState(0);

  useFocusEffect(
    useCallback(() => {
      learnApi
        .getLessons(skill)
        .then(setLessons)
        .catch((e) => setError(extractErrorMessage(e, "Darslarni yuklab bo'lmadi")));
    }, [skill]),
  );

  const sorted = useMemo(() => [...(lessons ?? [])].sort((a, b) => a.unit - b.unit), [lessons]);
  const nextCode = sorted.find((l) => !l.passed)?.code;

  const layout = useMemo(() => {
    const amp = Math.min(84, Math.max(0, (width - NODE - 70) / 2));
    const pts = sorted.map((l, i) => {
      const top = TOP + i * ROW;
      return { l, top, cx: width / 2 + Math.sin(i * 0.95 + 0.3) * amp, cy: top + NODE / 2 };
    });
    return { pts, height: TOP + sorted.length * ROW + 24 };
  }, [sorted, width]);

  if (!lessons) {
    return (
      <View style={styles.center}>
        {error ? <Text style={styles.error}>{error}</Text> : <ActivityIndicator color={colors.primary} />}
      </View>
    );
  }

  const passed = lessons.filter((l) => l.passed).length;
  const next = sorted.find((l) => l.code === nextCode);

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <IconBadge name={SKILL_ICON[skill]} tone={meta.tone} size={52} />
        <View style={{ flex: 1, gap: 8 }}>
          <Text style={styles.heroTitle}>{meta.label}</Text>
          <Bar pct={lessons.length ? (passed / lessons.length) * 100 : 0} tone={meta.tone} height={6} />
          <Text style={styles.heroSub}>
            {passed} / {lessons.length} dars o'zlashtirildi
          </Text>
        </View>
      </View>

      {next ? (
        <Pressable
          style={({ pressed }) => [styles.go, { backgroundColor: meta.tone }, pressed && { opacity: 0.9 }]}
          onPress={() => nav.navigate('LearnPlay', { mode: 'lesson', code: next.code })}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.goLabel}>Davom etish</Text>
            <Text style={styles.goTitle} numberOfLines={1}>
              {next.title}
            </Text>
          </View>
          <Ionicons name="play-circle" size={30} color="#fff" />
        </Pressable>
      ) : lessons.length > 0 ? (
        <View style={styles.finished}>
          <Ionicons name="trophy" size={20} color={colors.secondary} />
          <Text style={styles.finishedText}>Bu yo'nalishdagi hamma darslar tugatildi. Barakalla!</Text>
        </View>
      ) : null}

      <View style={{ height: layout.height }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        {width > 0 &&
          layout.pts.map((p, i) => {
            const prev = layout.pts[i - 1];
            const dots = prev
              ? [0.37, 0.46, 0.54, 0.63].map((t) => ({ x: prev.cx + (p.cx - prev.cx) * t, y: prev.cy + (p.cy - prev.cy) * t }))
              : [];
            return (
              <React.Fragment key={p.l.code}>
                {dots.map((d, k) => (
                  <View
                    key={k}
                    style={[styles.pathDot, { left: d.x - 3, top: d.y - 3 }, (prev.l.passed && p.l.passed) || prev.l.passed ? { backgroundColor: meta.tone, opacity: 0.55 } : null]}
                  />
                ))}
                <Node
                  lesson={p.l}
                  side={p.cx > width / 2 ? 'left' : 'right'}
                  state={p.l.passed ? 'done' : p.l.code === nextCode ? 'next' : 'todo'}
                  tone={meta.tone}
                  left={p.cx}
                  top={p.top}
                  onPress={() => nav.navigate('LearnPlay', { mode: 'lesson', code: p.l.code })}
                />
              </React.Fragment>
            );
          })}
      </View>
    </ScrollView>
  );
}

function Node({ lesson, state, tone, left, top, side, onPress }: { lesson: LessonSummary; state: 'done' | 'next' | 'todo'; tone: string; left: number; top: number; side: 'left' | 'right'; onPress: () => void }) {
  const size = state === 'next' ? NODE + 8 : NODE;
  const icon = lessonIcon(lesson);
  return (
    <Pressable style={[styles.node, { left: left - size / 2, top: top - (state === 'next' ? 4 : 0), width: size, height: size }]} onPress={onPress} accessibilityLabel={lesson.title}>
      <View
        style={[
          styles.circle,
          { width: size, height: size, borderRadius: size / 2 },
          state === 'done' && { backgroundColor: `${colors.secondary}26`, borderColor: colors.secondary },
          state === 'next' && { backgroundColor: tone, borderColor: tone, shadowColor: tone, shadowOpacity: 0.35, shadowRadius: 9, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
          state === 'todo' && { backgroundColor: `${tone}1A`, borderColor: `${tone}55` },
        ]}
      >
        <Ionicons name={icon} size={state === 'next' ? 28 : 23} color={state === 'done' ? colors.secondary : state === 'next' ? '#fff' : tone} />
        {state === 'done' ? (
          <View style={styles.badge}>
            <Ionicons name="checkmark" size={11} color="#fff" />
          </View>
        ) : null}
      </View>
      <View style={[styles.label, side === 'right' ? { left: size + 10, alignItems: 'flex-start' } : { right: size + 10, alignItems: 'flex-end' }]}>
        <Text style={[styles.nodeTitle, state === 'next' && { fontWeight: '800' }]} numberOfLines={1}>
          {lesson.title}
        </Text>
        {lesson.bestScore !== null ? <Text style={[styles.nodeScore, lesson.passed && { color: colors.greenText }]}>{lesson.bestScore}%</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = themed(() =>
  StyleSheet.create({
    page: { flex: 1, backgroundColor: colors.background },
    content: { padding: 20, paddingBottom: 40 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: 20 },
    error: { color: colors.danger },
    hero: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    heroTitle: { color: colors.text, fontSize: 26, fontWeight: '800', letterSpacing: -0.4 },
    heroSub: { color: colors.textMuted, fontSize: 13.5 },
    go: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 16, marginTop: 18 },
    goLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '600' },
    goTitle: { color: '#fff', fontSize: 17, fontWeight: '800', marginTop: 1 },
    finished: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.greenBg, borderRadius: 14, padding: 14, marginTop: 18 },
    finishedText: { color: colors.greenText, fontWeight: '600', flex: 1 },
    pathDot: { position: 'absolute', width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
    node: { position: 'absolute' },
    label: { position: 'absolute', top: 0, bottom: 0, width: 120, justifyContent: 'center' },
    circle: { alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
    badge: { position: 'absolute', right: -3, bottom: -3, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.secondary, borderWidth: 2, borderColor: colors.background, alignItems: 'center', justifyContent: 'center' },
    nodeTitle: { color: colors.text, fontSize: 13.5, fontWeight: '600' },
    nodeScore: { color: colors.textMuted, fontSize: 11.5, fontWeight: '700' },
  }),
);
