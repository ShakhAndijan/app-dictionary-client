import React from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, themed } from '../theme/colors';
import { speakEnglish } from '../services/speech';

interface Props {
  text: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

/** Tap: speaks the English word. Long press: speaks it slowly. */
export default function SpeakButton({ text, size = 22, style }: Props) {
  return (
    <Pressable
      onPress={() => speakEnglish(text)}
      onLongPress={() => speakEnglish(text, true)}
      hitSlop={10}
      style={({ pressed }) => [styles.btn, { width: size + 16, height: size + 16, borderRadius: (size + 16) / 2 }, pressed && styles.pressed, style]}
      accessibilityRole="button"
      accessibilityLabel="Talaffuzni eshitish"
    >
      <Ionicons name="volume-high" size={size} color={colors.primary} />
    </Pressable>
  );
}

const styles = themed(() => StyleSheet.create({
  btn: { alignItems: 'center', justifyContent: 'center', backgroundColor: `${colors.primary}14` },
  pressed: { opacity: 0.6 },
}));
