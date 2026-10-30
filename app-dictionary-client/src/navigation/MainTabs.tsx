import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabParamList } from './types';
import QuizScreen from '../screens/quiz/QuizScreen';
import WordsScreen from '../screens/words/WordsScreen';
import ProfileNavigator from './ProfileNavigator';
import { colors } from '../theme/colors';
import OfflineBanner from '../components/OfflineBanner';
import { initOfflineSync, onQueueSynced } from '../services/offlineSync';
import { requestProgressCheck } from '../services/progressEvents';
import * as wordsApi from '../api/wordsApi';
import * as reviewApi from '../api/reviewApi';
import AchievementCelebration from '../components/AchievementCelebration';
import { syncReminders } from '../services/reminders';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<keyof MainTabParamList, [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap]> = {
  Baholash: ['checkmark-done-circle', 'checkmark-done-circle-outline'],
  Sozlar: ['book', 'book-outline'],
  Profil: ['person-circle', 'person-circle-outline'],
};

export default function MainTabs() {
  // Fixed height would hide the system navigation buttons area, so add the bottom inset to it.
  const { bottom } = useSafeAreaInsets();

  // Offline support: track the connection and upload answers given without it. When they are through,
  // pull the server's fresh numbers back into the phone's copy.
  useEffect(() => {
    initOfflineSync();
    return onQueueSynced(() => {
      wordsApi.getWords().catch(() => undefined);
      reviewApi.getReviewSummary().catch(() => undefined);
      syncReminders();
      requestProgressCheck();
    });
  }, []);

  // Rebuild the upcoming reminders on start and whenever the app returns to the foreground.
  useEffect(() => {
    syncReminders();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') syncReminders();
    });
    return () => sub.remove();
  }, []);
  return (
    <>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          borderTopColor: colors.border,
          height: 60 + bottom,
          paddingBottom: 8 + bottom,
          paddingTop: 8,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const [filled, outline] = TAB_ICONS[route.name as keyof MainTabParamList];
          return <Ionicons name={focused ? filled : outline} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Baholash" component={QuizScreen} options={{ title: 'Baholash' }} />
      <Tab.Screen name="Sozlar" component={WordsScreen} options={{ title: "So'zlar" }} />
      <Tab.Screen name="Profil" component={ProfileNavigator} options={{ title: 'Profil' }} />
    </Tab.Navigator>
    <AchievementCelebration />
    <OfflineBanner />
    </>
  );
}
