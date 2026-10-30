import apiClient from './client';
import { DailyStats, MonthlyStats, StatsSummary } from '../types';

export function getDailyStats() {
  return apiClient.get<DailyStats[]>('/stats/daily').then((r) => r.data);
}

export function getMonthlyStats() {
  return apiClient.get<MonthlyStats[]>('/stats/monthly').then((r) => r.data);
}

export function getStatsSummary() {
  return apiClient.get<StatsSummary>('/stats/summary').then((r) => r.data);
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

export function getWeeklyReport(weeksBack = 0) {
  return apiClient.get<WeeklyReport>('/stats/weekly', { params: { weeksBack } }).then((r) => r.data);
}
