import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { colors, themed } from '../theme/colors';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export default function Input({ label, error, icon, secureTextEntry, style, ...rest }: Props) {
  const [hidden, setHidden] = useState(!!secureTextEntry);
  const { scheme } = useTheme();
  const isPasswordField = !!secureTextEntry;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, error && styles.inputWrapperError]}>
        {icon && <Ionicons name={icon} size={18} color={colors.textMuted} style={styles.icon} />}
        <TextInput
          placeholderTextColor={colors.textMuted}
          keyboardAppearance={scheme}
          selectionColor={colors.primary}
          secureTextEntry={isPasswordField ? hidden : false}
          style={[styles.input, icon && styles.inputWithIcon, style]}
          {...rest}
        />
        {isPasswordField && (
          <Pressable hitSlop={8} onPress={() => setHidden((prev) => !prev)}>
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = themed(() => StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
  },
  inputWrapperError: { borderColor: colors.danger },
  icon: { marginRight: 8 },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 16,
    color: colors.text,
  },
  inputWithIcon: { paddingLeft: 0 },
  errorText: { color: colors.danger, fontSize: 12, marginTop: 4 },
}));
