export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Baholash: undefined;
  Sozlar: undefined;
  Profil: undefined;
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
