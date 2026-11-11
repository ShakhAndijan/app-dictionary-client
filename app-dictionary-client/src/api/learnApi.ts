import apiClient from './client';

export type Skill = 'READING' | 'LISTENING' | 'SPEAKING' | 'WRITING' | 'GRAMMAR';
export type ItemKind = 'CHOICE' | 'FILL' | 'ORDER' | 'SPEAK';

export interface LessonSummary {
  code: string;
  skill: Skill;
  topic: string;
  title: string;
  unit: number;
  itemCount: number;
  bestScore: number | null;
  passed: boolean;
}

export interface Goal {
  skill: Skill;
  target: number;
  done: number;
  suggested: LessonSummary[];
}

export interface Overview {
  level: string | null;
  levels: string[];
  progress: { passed: number; total: number; percent: number };
  examUnlocked: boolean;
  lastExam: { percent: number; passed: boolean; at: string } | null;
  goals: Goal[];
  goalsDone: boolean;
  skills: { skill: Skill; lessonsTotal: number; lessonsPassed: number }[];
}

export interface ItemView {
  id: string;
  kind: ItemKind;
  prompt: string;
  options: string[] | null;
  words: string[] | null;
  passage?: string | null;
  audioText?: string | null;
}

export interface LessonDetail {
  code: string;
  level: string;
  skill: Skill;
  topic: string;
  title: string;
  intro: string | null;
  passage: string | null;
  audioText: string | null;
  items: ItemView[];
}

export interface CheckResult {
  correct: boolean;
  answer: string;
  explain: string | null;
}

export interface FinishResult {
  correct: number;
  total: number;
  score: number;
  passed: boolean;
  xpGained: number;
  results: { itemId: string; correct: boolean; answer: string; explain: string | null }[];
}

export interface ExamQuestion {
  ref: string;
  skill: Skill;
  kind: ItemKind;
  prompt: string;
  options: string[] | null;
  words: string[] | null;
  passage: string | null;
  audioText: string | null;
}

export interface ExamResult {
  percent: number;
  passed: boolean;
  skills: { skill: Skill; correct: number; total: number; percent: number }[];
  newLevel: string | null;
  xpGained: number;
}

export interface SkillStat {
  skill: Skill;
  lessonsTotal: number;
  lessonsPassed: number;
  lessonPercent: number | null;
  examPercent: number | null;
  percent: number | null;
  attempts: number;
  answered: number;
  correct: number;
  lastAt: string | null;
  recent: { code: string; title: string; percent: number; passed: boolean; at: string }[];
  weakLessons: { code: string; title: string; bestScore: number }[];
}

export interface LearnStats {
  level: string | null;
  skills: SkillStat[];
  weakest: Skill | null;
  answered: number;
  correct: number;
  activeDays: number;
  examsTaken: number;
  passMark: number;
}

export const getStats = () => apiClient.get<LearnStats>('/learn/stats').then((r) => r.data);
export const getOverview = () => apiClient.get<Overview>('/learn/overview').then((r) => r.data);
export const setLevel = (level: string) => apiClient.put<Overview>('/learn/level', { level }).then((r) => r.data);
export const getLessons = (skill?: Skill) =>
  apiClient.get<LessonSummary[]>('/learn/lessons', { params: skill ? { skill } : undefined }).then((r) => r.data);
export const getLesson = (code: string) => apiClient.get<LessonDetail>(`/learn/lessons/${code}`).then((r) => r.data);
export const checkAnswer = (code: string, itemId: string, answer: string) =>
  apiClient.post<CheckResult>(`/learn/lessons/${code}/check`, { itemId, answer }).then((r) => r.data);
export const finishLesson = (code: string, answers: { itemId: string; answer: string }[]) =>
  apiClient.post<FinishResult>(`/learn/lessons/${code}/finish`, { answers }).then((r) => r.data);
export const getExam = () => apiClient.get<ExamQuestion[]>('/learn/exam').then((r) => r.data);
export const submitExam = (answers: { ref: string; answer: string }[]) =>
  apiClient.post<ExamResult>('/learn/exam', { answers }).then((r) => r.data);

export const SKILL_META: Record<Skill, { icon: string; label: string; tone: string }> = {
  READING: { icon: '📖', label: "O'qish", tone: '#6366F1' },
  LISTENING: { icon: '🎧', label: 'Tinglash', tone: '#0EA5E9' },
  SPEAKING: { icon: '🎤', label: 'Gapirish', tone: '#F59E0B' },
  WRITING: { icon: '✍️', label: 'Yozish', tone: '#10B981' },
  GRAMMAR: { icon: '🧩', label: 'Grammatika', tone: '#A855F7' },
};

export const SKILL_ORDER: Skill[] = ['READING', 'LISTENING', 'SPEAKING', 'WRITING', 'GRAMMAR'];
