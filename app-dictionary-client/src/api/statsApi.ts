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
