import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '../types';
import * as authApi from '../api/authApi';
import { setOnUnauthorized } from '../api/client';
import { cancelReminders } from '../services/reminders';
import { loadLastUser, saveLastUser, setOfflineUser } from '../services/offlineStore';
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from '../api/tokenStorage';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Pick<User, 'firstName' | 'lastName' | 'email' | 'dailyGoal'>>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // The offline store is keyed by user, so it must learn about a change before anything reads it.
  const applyUser = useCallback((u: User | null) => {
    setOfflineUser(u?.id ?? null);
    setUser(u);
    if (u) saveLastUser(u);
  }, []);

  const clearSession = useCallback(async () => {
    await clearTokens();
    await cancelReminders();
    applyUser(null);
  }, [applyUser]);

  // Revokes the refresh token on the server first (best effort), then always clears the session locally.
  const logout = useCallback(async () => {
    try {
      await authApi.logout(await getRefreshToken());
    } catch {
      // Offline or already-expired session: still sign the user out locally.
    } finally {
      await clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    // The refresh token was rejected, so the session is already dead server-side:
    // skip the server call (avoids a 401 loop) and just sign out locally.
    setOnUnauthorized(() => {
      clearSession();
    });
  }, [clearSession]);

  useEffect(() => {
    (async () => {
      try {
        if (await getAccessToken()) {
          // An expired access token is renewed transparently by the API client.
          applyUser(await authApi.fetchMe());
        }
      } catch (e) {
        // Keep the tokens when we were merely offline so the next launch can still resume the session.
        if (!axios.isAxiosError(e) || e.response) {
          await clearTokens();
        } else {
          // Offline: open with the profile saved last time instead of showing the login screen.
          const saved = await loadLastUser();
          if (saved) applyUser(saved);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (username: string, password: string) => {
    const res = await authApi.login(username, password);
    await saveTokens(res);
    const me = await authApi.fetchMe();
    applyUser(me);
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string
  ) => {
    const res = await authApi.register(firstName, lastName, email, username, password);
    await saveTokens(res);
    const me = await authApi.fetchMe();
    applyUser(me);
  };

  const updateProfile = async (data: Partial<Pick<User, 'firstName' | 'lastName' | 'email' | 'dailyGoal'>>) => {
    const updated = await authApi.updateProfile(data);
    applyUser(updated);
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    // All other sessions are signed out by the server; keep this one with the fresh tokens.
    await saveTokens(await authApi.changePassword(oldPassword, newPassword));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
