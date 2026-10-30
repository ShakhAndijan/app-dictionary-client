import apiClient from './client';

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

export function listGroups() {
  return apiClient.get<GroupSummary[]>('/groups').then((r) => r.data);
}

export function createGroup(name: string, emoji: string) {
  return apiClient.post<GroupSummary>('/groups', { name, emoji }).then((r) => r.data);
}

export function joinGroup(code: string) {
  return apiClient.post<GroupSummary>('/groups/join', { code }).then((r) => r.data);
}

export function getGroup(id: number) {
  return apiClient.get<GroupDetail>(`/groups/${id}`).then((r) => r.data);
}

export function leaveGroup(id: number) {
  return apiClient.delete(`/groups/${id}/members/me`).then(() => undefined);
}

export function removeGroupMember(id: number, userId: number) {
  return apiClient.delete(`/groups/${id}/members/${userId}`).then(() => undefined);
}

export function deleteGroup(id: number) {
  return apiClient.delete(`/groups/${id}`).then(() => undefined);
}
