import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from './types';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';
import StatsScreen from '../screens/profile/StatsScreen';
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
    </Stack.Navigator>
  );
}
