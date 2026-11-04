import apiClient from './client';

export interface Announcement {
  id: number;
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  createdBy: string;
  createdAt: string;
}

export function getAnnouncements() {
  return apiClient.get<Announcement[]>('/announcements').then((r) => r.data);
}
