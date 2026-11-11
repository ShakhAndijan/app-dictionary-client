import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, themed } from '../../theme/colors';
import * as learnApi from '../../api/learnApi';
import { LessonSummary } from '../../api/learnApi';
import { extractErrorMessage } from '../../utils/errors';
import { LearnStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<LearnStackParamList, 'LearnLessons'>;

export default function LearnLessonsScreen({ route }: Props) {
  const { skill } = route.params;
  const nav = useNavigation<NativeStackNavigationProp<LearnStackParamList>>();
  const [lessons, setLessons] = useState<LessonSummary[] | null>(null);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      learnApi
        .getLessons(skill)
        .then(setLessons)
        .catch((e) => setError(extractErrorMessage(e, "Darslarni yuklab bo'lmadi")));
    }, [skill]),
  );

  if (!lessons) {
    return (
      <View style={styles.center}>
        {error ? <Text style={styles.error}>{error}</Text> : <ActivityIndicator color={colors.primary} />}
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={lessons}
      keyExtractor={(l) => l.code}
      renderItem={({ item, index }) => (
        <Pressable style={styles.row} onPress={() => nav.navigate('LearnPlay', { mode: 'lesson', code: item.code })}>
          <Text style={[styles.num, item.passed && styles.numDone]}>{item.passed ? '✓' : index + 1}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.sub} numberOfLines={1}>
              {item.topic}
            </Text>
          </View>
          <Text style={styles.score}>{item.bestScore !== null ? `${item.bestScore}%` : `${item.itemCount}`}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = themed(() =>
  StyleSheet.create({
    list: { flex: 1, backgroundColor: colors.background },
    content: { padding: 16, gap: 10 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: 20 },
    error: { color: colors.danger },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border },
    num: { width: 34, height: 34, borderRadius: 17, textAlign: 'center', lineHeight: 34, backgroundColor: colors.indigoBg, color: colors.indigoText, fontWeight: '700', overflow: 'hidden' },
    numDone: { backgroundColor: colors.greenBg, color: colors.greenText },
    title: { color: colors.text, fontWeight: '700', fontSize: 15 },
    sub: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
    score: { color: colors.textMuted, fontWeight: '600' },
  }),
);
