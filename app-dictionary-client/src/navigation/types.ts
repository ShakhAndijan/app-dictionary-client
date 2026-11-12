export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Baholash: undefined;
  Kurs: undefined;
  Gap: undefined;
  Sozlar: undefined;
  Profil: undefined;
  Admin: undefined;
};

import type { Skill } from '../api/learnApi';

export type LearnStackParamList = {
  LearnHome: undefined;
  LearnLessons: { skill: Skill };
  LearnPlay: { mode: 'lesson' | 'exam'; code?: string };
  LearnStats: undefined;
};

export type AdminStackParamList = {
  AdminHome: undefined;
  AdminUsers: undefined;
  AdminUser: { id: number; name: string };
  AdminAnnouncements: undefined;
  AdminAudit: undefined;
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  Stats: undefined;
  Reminders: undefined;
  Achievements: undefined;
  WeeklyReport: undefined;
  Groups: undefined;
  GroupDetail: { id: number; name: string };
};
