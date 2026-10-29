import apiClient from './client';
import { User } from '../types';

export interface AuthResponse {
  refreshToken: string;
  token: string;
  tokenType: string;
  username: string;
  expiresInSeconds: number;
}

export function login(username: string, password: string) {
  return apiClient.post<AuthResponse>('/auth/login', { username, password }).then((r) => r.data);
}

export function register(
  firstName: string,
  lastName: string,
  email: string,
  username: string,
  password: string
) {
  return apiClient
    .post<AuthResponse>('/auth/register', { firstName, lastName, email, username, password })
    .then((r) => r.data);
}

export function logout(refreshToken: string | null) {
  // Short timeout so a bad connection never blocks signing out locally.
  return apiClient
    .post('/auth/logout', refreshToken ? { refreshToken } : undefined, { timeout: 5000 })
    .then((r) => r.data);
}

export function fetchMe() {
  return apiClient.get<User>('/me').then((r) => r.data);
}

export function updateProfile(data: Partial<Pick<User, 'firstName' | 'lastName' | 'email' | 'dailyGoal'>>) {
  return apiClient.put<User>('/profile', data).then((r) => r.data);
}

export function changePassword(oldPassword: string, newPassword: string) {
  // The server signs out every other session and returns fresh tokens for this one.
  return apiClient.put<AuthResponse>('/profile/password', { oldPassword, newPassword }).then((r) => r.data);
}
