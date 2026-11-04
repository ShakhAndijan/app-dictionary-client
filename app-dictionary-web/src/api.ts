import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export const API_BASE_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

/* ------------------------------------------------------------------ types */

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  dailyGoal: number;
  role: 'USER' | 'ADMIN';
}

export type WordState = 'NEW' | 'LEARNING' | 'MASTERED';

export interface Word {
  id: number;
  english: string;
  uzbek: string;
  definition: string | null;
  createdAt: string;
  state: WordState;
  lapses: number;
  weak: boolean;
  imageVersion: number | null;
  favorite: boolean;
  nextReviewDate?: string | null;
}

export interface ReviewSummary {
  dueCount: number;
  newCount: number;
  learningCount: number;
  masteredCount: number;
  totalWords: number;
  weakCount: number;
  dailyGoal: number;
  todayDone: number;
}

export type QuizPromptType = 'english' | 'uzbek' | 'definition';
export type QuizMode = 'ALL' | 'TODAY' | 'DUE' | 'WEAK' | 'FAVORITES';
export type AnswerFormat = 'TYPED' | 'CHOICE' | 'FLASHCARD' | 'LISTENING' | 'MATCHING' | 'SPEED';

export interface DailyStats {
  date: string;
  wordsAdded: number;
  quizzesTaken: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracyPercent: number;
}

export interface MonthlyStats {
  month: string;
  wordsAdded: number;
  quizzesTaken: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracyPercent: number;
}

export interface FormatStats {
  format: AnswerFormat;
  total: number;
  correct: number;
  accuracyPercent: number;
}

export interface StatsSummary {
  totalWords: number;
  totalQuizzes: number;
  totalCorrect: number;
  totalIncorrect: number;
  accuracyPercent: number;
  activeDays: number;
  currentStreak: number;
  bestStreak: number;
  formats: FormatStats[];
}

export interface WeeklyTotals {
  answers: number;
  correct: number;
  accuracyPercent: number;
  wordsAdded: number;
  wordsPracticed: number;
  xp: number;
  activeDays: number;
  goalDays: number;
}

export interface WeeklyDay {
  date: string;
  answers: number;
  correct: number;
  wordsAdded: number;
  xp: number;
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  currentWeek: boolean;
  totals: WeeklyTotals;
  previous: WeeklyTotals;
  days: WeeklyDay[];
  bestDay: string | null;
}

export type AchievementTier = 'BRONZE' | 'SILVER' | 'GOLD';

export interface Achievement {
  code: string;
  title: string;
  description: string;
  icon: string;
  tier: AchievementTier;
  xpReward: number;
  current: number;
  target: number;
  unlocked: boolean;
  unlockedAt: string | null;
  justUnlocked: boolean;
}

export interface Progress {
  totalXp: number;
  level: number;
  levelTitle: string;
  xpIntoLevel: number;
  xpForLevel: number;
  todayXp: number;
  weekXp: number;
  unlockedCount: number;
  totalAchievements: number;
  achievements: Achievement[];
}

export interface GroupSummary {
  id: number;
  name: string;
  emoji: string;
  memberCount: number;
  ownedByMe: boolean;
}

export interface GroupMember {
  userId: number;
  name: string;
  username: string;
  level: number;
  levelTitle: string;
  weekXp: number;
  totalXp: number;
  me: boolean;
  owner: boolean;
}

export interface GroupDetail {
  id: number;
  name: string;
  emoji: string;
  inviteCode: string;
  ownedByMe: boolean;
  weekStart: string;
  members: GroupMember[];
}

export interface QuizProgress {
  answered: number;
  correctCount: number;
  incorrectCount: number;
  totalWords: number;
  unlimited: boolean;
  finished: boolean;
}

export interface QuizQuestion {
  sessionId: number;
  promptType: QuizPromptType;
  promptText: string;
  progress: QuizProgress;
  options: string[] | null;
  /** The language the answer must be written in. */
  answerLanguage: "english" | "uzbek";
}

export interface QuizAnswerResult {
  correct: boolean;
  closeMatch: boolean;
  correctAnswer: string;
  answeredPromptType: QuizPromptType;
  progress: QuizProgress;
  nextPromptType: QuizPromptType | null;
  nextPromptText: string | null;
  nextOptions: string[] | null;
  xpGained: number;
  nextAnswerLanguage: "english" | "uzbek" | null;
}

export interface QuizSummary {
  sessionId: number;
  mode: QuizMode;
  totalAnswered: number;
  correctCount: number;
  incorrectCount: number;
  startedAt: string;
  finishedAt: string | null;
}

export interface WordSuggestion {
  english: string | null;
  uzbek: string | null;
  definition: string | null;
  example: string | null;
  phonetic: string | null;
  /** Other words that fit, when the lookup started from a typed definition. */
  alternatives?: string[];
}

export interface WordImagePayload {
  contentType: string;
  data: string;
}

export interface AuthResponse {
  refreshToken: string;
  token: string;
  tokenType: string;
  username: string;
  expiresInSeconds: number;
}

/* ----------------------------------------------------------------- tokens */

const ACCESS_KEY = 'auth_token';
const REFRESH_KEY = 'refresh_token';

export const tokens = {
  access: () => localStorage.getItem(ACCESS_KEY),
  refresh: () => localStorage.getItem(REFRESH_KEY),
  save(pair: { token: string; refreshToken: string }) {
    localStorage.setItem(ACCESS_KEY, pair.token);
    localStorage.setItem(REFRESH_KEY, pair.refreshToken);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

/* ----------------------------------------------------------------- client */

const TIMEOUT_MS = 15000;
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

type Retriable = InternalAxiosRequestConfig & { _retried?: boolean };

const http = axios.create({ baseURL: API_BASE_URL, timeout: TIMEOUT_MS });
// Separate instance without interceptors so a failing refresh can never recurse into itself.
const refreshHttp = axios.create({ baseURL: API_BASE_URL, timeout: TIMEOUT_MS });

http.interceptors.request.use((config) => {
  const token = tokens.access();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let onUnauthorized: (() => void) | null = null;
export function setOnUnauthorized(handler: () => void) {
  onUnauthorized = handler;
}

// Refresh tokens are single-use, so concurrent 401s must share one refresh request.
let refreshInFlight: Promise<string> | null = null;

function refreshAccessToken(): Promise<string> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const refreshToken = tokens.refresh();
      if (!refreshToken) throw new Error('No refresh token');
      const { data } = await refreshHttp.post<AuthResponse>('/auth/refresh', { refreshToken });
      tokens.save(data);
      return data.token;
    })().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

http.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const config = error.config as Retriable | undefined;
    const isAuth = !!config?.url && AUTH_ENDPOINTS.some((p) => config.url!.includes(p));
    if (error.response?.status !== 401 || !config || config._retried || isAuth) {
      return Promise.reject(error);
    }
    config._retried = true;
    try {
      const token = await refreshAccessToken();
      config.headers.Authorization = `Bearer ${token}`;
      return http(config);
    } catch (refreshError) {
      // A network blip must not log the user out; only a rejected refresh token ends the session.
      if (axios.isAxiosError(refreshError) && !refreshError.response) return Promise.reject(error);
      tokens.clear();
      onUnauthorized?.();
      return Promise.reject(error);
    }
  }
);

export function errorMessage(e: unknown, fallback: string): string {
  if (axios.isAxiosError(e)) {
    const data = e.response?.data as { message?: string; error?: string } | undefined;
    if (data?.message) return data.message;
    if (!e.response) return "Serverga ulanib bo'lmadi. Internetni tekshiring.";
  }
  return fallback;
}

export function errorStatus(e: unknown): number | undefined {
  return axios.isAxiosError(e) ? e.response?.status : undefined;
}

/* -------------------------------------------------------------- endpoints */

const d = <T>(p: Promise<{ data: T }>) => p.then((r) => r.data);

export const authApi = {
  login: (username: string, password: string) => d(http.post<AuthResponse>('/auth/login', { username, password })),
  register: (firstName: string, lastName: string, email: string, username: string, password: string) =>
    d(http.post<AuthResponse>('/auth/register', { firstName, lastName, email, username, password })),
  logout: (refreshToken: string | null) =>
    http.post('/auth/logout', refreshToken ? { refreshToken } : undefined, { timeout: 5000 }),
  me: () => d(http.get<User>('/me')),
  updateProfile: (data: Partial<Pick<User, 'firstName' | 'lastName' | 'email' | 'dailyGoal'>>) =>
    d(http.put<User>('/profile', data)),
  changePassword: (oldPassword: string, newPassword: string) =>
    d(http.put<AuthResponse>('/profile/password', { oldPassword, newPassword })),
};

export const wordsApi = {
  list: () => d(http.get<Word[]>('/words')),
  add: (data: { english: string; uzbek: string; definition?: string }) => d(http.post<Word>('/words', data)),
  update: (id: number, data: Partial<{ english: string; uzbek: string; definition: string; favorite: boolean }>) =>
    d(http.put<Word>(`/words/${id}`, data)),
  remove: (id: number) => http.delete(`/words/${id}`),
  suggest: (from: { english: string } | { uzbek: string } | { definition: string }) => d(http.get<WordSuggestion>('/words/suggest', { params: from })),
  setImage: (id: number, image: WordImagePayload) => d(http.put<Word>(`/words/${id}/image`, image)),
  getImage: (id: number) => d(http.get<WordImagePayload>(`/words/${id}/image`)),
  deleteImage: (id: number) => d(http.delete<Word>(`/words/${id}/image`)),
};

export const reviewApi = {
  summary: () => d(http.get<ReviewSummary>('/review/summary')),
};

export const flashcardApi = {
  deck: (mode: QuizMode) => d(http.get<Word[]>('/flashcards', { params: { mode } })),
  answer: (wordId: number, known: boolean, format: 'FLASHCARD' | 'MATCHING' = 'FLASHCARD') =>
    http.post('/flashcards/answer', { wordId, known, format }),
};

export const quizApi = {
  start: (mode: QuizMode, format: AnswerFormat = 'TYPED') => d(http.post<QuizQuestion>('/quiz/start', { mode, format })),
  answer: (sessionId: number, answer: string) =>
    d(http.post<QuizAnswerResult>(`/quiz/${sessionId}/answer`, { answer })),
  finish: (sessionId: number) => d(http.post<QuizSummary>(`/quiz/${sessionId}/finish`)),
};

export const statsApi = {
  daily: () => d(http.get<DailyStats[]>('/stats/daily')),
  monthly: () => d(http.get<MonthlyStats[]>('/stats/monthly')),
  summary: () => d(http.get<StatsSummary>('/stats/summary')),
  weekly: (weeksBack = 0) => d(http.get<WeeklyReport>('/stats/weekly', { params: { weeksBack } })),
};

export interface AdminOverview {
  totalUsers: number;
  newToday: number;
  newLast7Days: number;
  newLast30Days: number;
  activeToday: number;
  activeLast7Days: number;
  activeLast30Days: number;
  totalWords: number;
  totalReviews: number;
  accuracyPercent: number;
  totalQuizSessions: number;
  series: { date: string; newUsers: number; activeUsers: number }[];
}

export interface AdminUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string | null;
  lastLoginAt: string | null;
  lastActiveAt: string | null;
  wordCount: number;
  reviewCount: number;
  correctCount: number;
  totalXp: number;
  blocked: boolean;
}

export interface AdminInsights {
  days: number;
  formats: { format: string; answers: number; correct: number }[];
  retention: { days: number; cohort: number; retained: number }[];
  hardestWords: { english: string; answers: number; wrong: number }[];
}

export interface AdminUserDetail {
  user: AdminUser;
  level: number;
  levelTitle: string;
  words: Word[];
  recentReviews: { answeredAt: string; english: string; correct: boolean; format: string }[];
  weekly: WeeklyReport;
  achievements: { code: string; title: string; description: string; icon: string; tier: AchievementTier; unlockedAt: string }[];
  totalAchievements: number;
}

export type AnnouncementSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface Announcement {
  id: number;
  message: string;
  severity: AnnouncementSeverity;
  createdBy: string;
  createdAt: string;
}

export interface AuditEntry {
  id: number;
  actor: string;
  action: string;
  target: string | null;
  details: string | null;
  at: string;
}

export const adminApi = {
  overview: (days = 14) => d(http.get<AdminOverview>('/admin/overview', { params: { days } })),
  insights: (days = 30) => d(http.get<AdminInsights>('/admin/insights', { params: { days } })),
  users: () => d(http.get<AdminUser[]>('/admin/users')),
  detail: (id: number) => d(http.get<AdminUserDetail>(`/admin/users/${id}`)),
  setBlocked: (id: number, blocked: boolean) => d(http.put<AdminUser>(`/admin/users/${id}/blocked`, { blocked })),
  deleteUser: (id: number) => http.delete(`/admin/users/${id}`),
  setRole: (id: number, role: 'ADMIN' | 'USER') => d(http.put<AdminUser>(`/admin/users/${id}/role`, { role })),
  rename: (id: number, firstName: string, lastName: string) =>
    d(http.put<AdminUser>(`/admin/users/${id}`, { firstName, lastName })),
  announcements: () => d(http.get<Announcement[]>('/admin/announcements')),
  announce: (message: string, severity: AnnouncementSeverity) =>
    d(http.post<Announcement>('/admin/announcements', { message, severity })),
  deleteAnnouncement: (id: number) => http.delete(`/admin/announcements/${id}`),
  audit: (limit = 100) => d(http.get<AuditEntry[]>('/admin/audit', { params: { limit } })),
};

export const announcementsApi = {
  current: () => d(http.get<Announcement[]>('/announcements')),
};

export const progressApi = {
  get: () => d(http.get<Progress>('/progress')),
  seen: () => http.post('/progress/seen'),
};

export const groupsApi = {
  list: () => d(http.get<GroupSummary[]>('/groups')),
  create: (name: string, emoji: string) => d(http.post<GroupSummary>('/groups', { name, emoji })),
  join: (code: string) => d(http.post<GroupSummary>('/groups/join', { code })),
  get: (id: number) => d(http.get<GroupDetail>(`/groups/${id}`)),
  leave: (id: number) => http.delete(`/groups/${id}/members/me`),
  removeMember: (id: number, userId: number) => http.delete(`/groups/${id}/members/${userId}`),
  remove: (id: number) => http.delete(`/groups/${id}`),
};
