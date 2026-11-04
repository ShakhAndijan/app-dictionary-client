import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminStackParamList } from './types';
import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import AdminUserScreen from '../screens/admin/AdminUserScreen';
import AdminAnnouncementsScreen from '../screens/admin/AdminAnnouncementsScreen';
import AdminAuditScreen from '../screens/admin/AdminAuditScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<AdminStackParamList>();

export default function AdminNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="AdminHome" component={AdminHomeScreen} options={{ title: 'Admin' }} />
      <Stack.Screen name="AdminUsers" component={AdminUsersScreen} options={{ title: 'Foydalanuvchilar' }} />
      <Stack.Screen name="AdminUser" component={AdminUserScreen} options={({ route }) => ({ title: route.params.name })} />
      <Stack.Screen name="AdminAnnouncements" component={AdminAnnouncementsScreen} options={{ title: "E'lonlar" }} />
      <Stack.Screen name="AdminAudit" component={AdminAuditScreen} options={{ title: 'Jurnal' }} />
    </Stack.Navigator>
  );
}
