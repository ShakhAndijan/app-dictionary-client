import apiClient from './client';
import { User } from '../types';

export interface AuthResponse {
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

export function fetchMe() {
  return apiClient.get<User>('/me').then((r) => r.data);
}

export function updateProfile(data: Partial<Pick<User, 'firstName' | 'lastName' | 'email'>>) {
  return apiClient.put<User>('/profile', data).then((r) => r.data);
}

export function changePassword(oldPassword: string, newPassword: string) {
  return apiClient.put('/profile/password', { oldPassword, newPassword }).then((r) => r.data);
}
