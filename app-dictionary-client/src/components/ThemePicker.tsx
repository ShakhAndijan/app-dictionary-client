import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, themed } from '../theme/colors';
import { ThemeMode, useTheme } from '../theme/ThemeContext';
import Card from './Card';

const OPTIONS: { mode: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { mode: 'system', label: 'Tizim', icon: 'phone-portrait-outline' },
  { mode: 'light', label: 'Kunduzgi', icon: 'sunny-outline' },
  { mode: 'dark', label: 'Tungi', icon: 'moon-outline' },
];

/** Day / night / follow-the-phone switch for the whole app. */
export default function ThemePicker() {
  const { mode, setMode } = useTheme();
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Ko'rinish</Text>
      <View style={styles.row}>
        {OPTIONS.map((o) => {
          const active = mode === o.mode;
          return (
            <Pressable
              key={o.mode}
              style={[styles.option, active && styles.optionActive]}
              onPress={() => setMode(o.mode)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Ionicons name={o.icon} size={20} color={active ? '#fff' : colors.textMuted} />
              <Text style={[styles.optionText, active && styles.optionTextActive]}>{o.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}

const styles = themed(() =>
  StyleSheet.create({
    card: { marginTop: 8 },
    title: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 10 },
    row: { flexDirection: 'row', gap: 8 },
    option: {
      flex: 1,
      alignItems: 'center',
      gap: 4,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    optionActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    optionText: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
    optionTextActive: { color: '#fff' },
  })
);
