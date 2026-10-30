import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from './types';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';
import StatsScreen from '../screens/profile/StatsScreen';
import WeeklyReportScreen from '../screens/profile/WeeklyReportScreen';
import GroupsScreen from '../screens/profile/GroupsScreen';
import GroupDetailScreen from '../screens/profile/GroupDetailScreen';
import AchievementsScreen from '../screens/profile/AchievementsScreen';
import ReminderSettingsScreen from '../screens/profile/ReminderSettingsScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="ProfileHome" component={ProfileScreen} options={{ title: 'Profil' }} />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Profilni tahrirlash' }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ title: 'Parolni almashtirish' }}
      />
      <Stack.Screen name="Stats" component={StatsScreen} options={{ title: 'Statistika' }} />
      <Stack.Screen
        name="Reminders"
        component={ReminderSettingsScreen}
        options={{ title: 'Eslatmalar va maqsad' }}
      />
      <Stack.Screen name="Achievements" component={AchievementsScreen} options={{ title: 'Yutuqlar' }} />
      <Stack.Screen name="WeeklyReport" component={WeeklyReportScreen} options={{ title: 'Haftalik hisobot' }} />
      <Stack.Screen name="Groups" component={GroupsScreen} options={{ title: 'Guruhlar' }} />
      <Stack.Screen
        name="GroupDetail"
        component={GroupDetailScreen}
        options={({ route }) => ({ title: route.params.name })}
      />
    </Stack.Navigator>
  );
}
