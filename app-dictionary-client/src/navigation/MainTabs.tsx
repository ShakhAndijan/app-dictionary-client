import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabParamList } from './types';
import QuizScreen from '../screens/quiz/QuizScreen';
import WordsScreen from '../screens/words/WordsScreen';
import ProfileNavigator from './ProfileNavigator';
import AdminNavigator from './AdminNavigator';
import LearnNavigator from './LearnNavigator';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import OfflineBanner from '../components/OfflineBanner';
import AnnouncementBanner from '../components/AnnouncementBanner';
import { initOfflineSync, onQueueSynced } from '../services/offlineSync';
import { requestProgressCheck } from '../services/progressEvents';
import * as wordsApi from '../api/wordsApi';
import * as reviewApi from '../api/reviewApi';
import AchievementCelebration from '../components/AchievementCelebration';
import { syncReminders } from '../services/reminders';
import ComingSoonScreen from '../screens/ComingSoonScreen';
import { DEFAULT_MODULES } from '../config/directions';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<keyof MainTabParamList, [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap]> = {
  Baholash: ['checkmark-done-circle', 'checkmark-done-circle-outline'],
  Kurs: ['school', 'school-outline'],
  Sozlar: ['book', 'book-outline'],
  Frontend: ['code-slash', 'code-slash-outline'],
  Profil: ['person-circle', 'person-circle-outline'],
  Admin: ['shield-checkmark', 'shield-checkmark-outline'],
};

export default function MainTabs() {
  // Fixed height would hide the system navigation buttons area, so add the bottom inset to it.
  const { bottom } = useSafeAreaInsets();
  const { user } = useAuth();
  const modules = user?.modules ?? DEFAULT_MODULES;
  const has = (...keys: string[]) => keys.some((k) => modules.includes(k));

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
      {has('words') && <Tab.Screen name="Baholash" component={QuizScreen} options={{ title: 'Baholash' }} />}
      {has('words', 'ielts') && <Tab.Screen name="Kurs" component={LearnNavigator} options={{ title: "Ingliz tili" }} />}
      {has('words') && <Tab.Screen name="Sozlar" component={WordsScreen} options={{ title: "So'zlar" }} />}
      {has('frontend') && (
        <Tab.Screen name="Frontend" options={{ title: 'Dasturlash' }}>
          {() => <ComingSoonScreen icon="code-slash" title="Dasturlash · Frontend" text="Frontend yo'nalishi tez orada ochiladi. Darslar va amaliy topshiriqlar tayyorlanmoqda." topics={['HTML', 'CSS', 'JavaScript', 'React']} />}
        </Tab.Screen>
      )}
      <Tab.Screen name="Profil" component={ProfileNavigator} options={{ title: 'Profil' }} />
      {user?.role === 'ADMIN' && <Tab.Screen name="Admin" component={AdminNavigator} options={{ title: 'Admin' }} />}
    </Tab.Navigator>
    <AchievementCelebration />
    <AnnouncementBanner />
    <OfflineBanner />
    </>
  );
}
