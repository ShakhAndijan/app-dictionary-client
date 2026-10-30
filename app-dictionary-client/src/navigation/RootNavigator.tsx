import React from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer, NavigationState } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainTabs from './MainTabs';
import { colors, themed } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

// The tree is remounted when the theme changes; remembering where the user was keeps them on the same screen.
let savedState: NavigationState | undefined;

export default function RootNavigator() {
  const { isLoading, isAuthenticated } = useAuth();
  const { scheme } = useTheme();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) savedState = undefined;

  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <NavigationContainer
      theme={navTheme}
      initialState={isAuthenticated ? savedState : undefined}
      onStateChange={(state) => {
        savedState = state;
      }}
    >
      {isAuthenticated ? <MainTabs /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = themed(() => StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
}));
