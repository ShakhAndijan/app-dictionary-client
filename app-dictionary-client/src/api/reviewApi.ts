import apiClient from './client';
import { ReviewSummary } from '../types';

export function getReviewSummary() {
  return apiClient.get<ReviewSummary>('/review/summary').then((r) => r.data);
}
