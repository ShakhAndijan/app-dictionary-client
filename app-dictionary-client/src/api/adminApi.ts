import apiClient from './client';
import { Word } from '../types';
import { Announcement } from './announcementsApi';

export type { Announcement };
export type Severity = 'INFO' | 'WARNING' | 'CRITICAL';

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

export interface AdminInsights {
  days: number;
  formats: { format: string; answers: number; correct: number }[];
  retention: { days: number; cohort: number; retained: number }[];
  hardestWords: { english: string; answers: number; wrong: number }[];
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

export interface AdminUserDetail {
  user: AdminUser;
  level: number;
  levelTitle: string;
  words: Word[];
  recentReviews: { answeredAt: string; english: string; correct: boolean; format: string }[];
  weekly: { weekStart: string; weekEnd: string; days: { date: string; answers: number; correct: number; xp: number }[] };
  achievements: { code: string; title: string; description: string; icon: string; tier: string; unlockedAt: string }[];
  totalAchievements: number;
}

export interface AuditEntry {
  id: number;
  actor: string;
  action: string;
  target: string | null;
  details: string | null;
  at: string;
}

const get = <T>(url: string, params?: object) => apiClient.get<T>(url, { params }).then((r) => r.data);

export const overview = (days: number) => get<AdminOverview>('/admin/overview', { days });
export const insights = (days: number) => get<AdminInsights>('/admin/insights', { days });
export const users = () => get<AdminUser[]>('/admin/users');
export const userDetail = (id: number) => get<AdminUserDetail>(`/admin/users/${id}`);
export const rename = (id: number, firstName: string, lastName: string) =>
  apiClient.put<AdminUser>(`/admin/users/${id}`, { firstName, lastName }).then((r) => r.data);
export const setBlocked = (id: number, blocked: boolean) =>
  apiClient.put<AdminUser>(`/admin/users/${id}/blocked`, { blocked }).then((r) => r.data);
export const deleteUser = (id: number) => apiClient.delete(`/admin/users/${id}`).then(() => undefined);
export const setRole =(id: number, role: 'ADMIN' | 'USER') =>
  apiClient.put<AdminUser>(`/admin/users/${id}/role`, { role }).then((r) => r.data);
export const announcements = () => get<Announcement[]>('/admin/announcements');
export const announce = (message: string, severity: Severity) =>
  apiClient.post<Announcement>('/admin/announcements', { message, severity }).then((r) => r.data);
export const deleteAnnouncement = (id: number) => apiClient.delete(`/admin/announcements/${id}`).then(() => undefined);
export const audit = (limit = 100) => get<AuditEntry[]>('/admin/audit', { limit });

// ---- Saved messages: the admin's private chat (text, images, videos, files) ----
export interface AdminNote {
  id: number;
  text: string | null;
  kind: 'NONE' | 'IMAGE' | 'VIDEO' | 'FILE';
  fileName: string | null;
  contentType: string | null;
  fileSize: number | null;
  /** Relative, signed and expiring: prefix it with the API base. */
  fileUrl: string | null;
  createdAt: string;
  editedAt: string | null;
}

export interface PickedFile {
  uri: string;
  name: string;
  mimeType?: string | null;
}

export const notes = (before?: number, limit = 40) => get<AdminNote[]>('/admin/notes', { before, limit });
export const addNote = (text: string, file: PickedFile | null, onProgress?: (percent: number) => void) => {
  const form = new FormData();
  if (text) form.append('text', text);
  if (file) {
    form.append('file', { uri: file.uri, name: file.name, type: file.mimeType || 'application/octet-stream' } as unknown as Blob);
  }
  // Videos can be big: no request timeout, progress for the bar.
  return apiClient
    .post<AdminNote>('/admin/notes', form, {
      timeout: 0,
      headers: { 'Content-Type': 'multipart/form-data' },
      transformRequest: (data) => data,
      onUploadProgress: (e) => onProgress?.(e.total ? Math.round((e.loaded / e.total) * 100) : 0),
    })
    .then((r) => r.data);
};
export const editNote = (id: number, text: string) => apiClient.put<AdminNote>(`/admin/notes/${id}`, { text }).then((r) => r.data);
export const deleteNote = (id: number) => apiClient.delete(`/admin/notes/${id}`).then(() => undefined);
