import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LearnStackParamList } from './types';
import LearnHomeScreen from '../screens/learn/LearnHomeScreen';
import LearnLessonsScreen from '../screens/learn/LearnLessonsScreen';
import LearnPlayScreen from '../screens/learn/LearnPlayScreen';
import LearnStatsScreen from '../screens/learn/LearnStatsScreen';
import { SKILL_META } from '../api/learnApi';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<LearnStackParamList>();

export default function LearnNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="LearnHome" component={LearnHomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="LearnLessons"
        component={LearnLessonsScreen}
        options={({ route }) => ({ title: SKILL_META[route.params.skill].label })}
      />
      <Stack.Screen name="LearnPlay" component={LearnPlayScreen} options={{ title: 'Dars' }} />
      <Stack.Screen name="LearnStats" component={LearnStatsScreen} options={{ title: 'Statistika' }} />
    </Stack.Navigator>
  );
}
