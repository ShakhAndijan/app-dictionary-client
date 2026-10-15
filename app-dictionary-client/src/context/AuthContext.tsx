import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types';
import * as authApi from '../api/authApi';
import { setOnUnauthorized, TOKEN_KEY } from '../api/client';

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
  updateProfile: (data: Partial<Pick<User, 'firstName' | 'lastName' | 'email'>>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    setOnUnauthorized(() => {
      logout();
    });
  }, [logout]);

  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
          const me = await authApi.fetchMe();
          setUser(me);
        }
      } catch {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (username: string, password: string) => {
    const res = await authApi.login(username, password);
    await SecureStore.setItemAsync(TOKEN_KEY, res.token);
    const me = await authApi.fetchMe();
    setUser(me);
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string
  ) => {
    const res = await authApi.register(firstName, lastName, email, username, password);
    console.log("Ro'yxatdan o'tish javobi:", res);
    await SecureStore.setItemAsync(TOKEN_KEY, res.token);
    const me = await authApi.fetchMe();
    console.log('Foydalanuvchi (/me):', me);
    setUser(me);
  };

  const updateProfile = async (data: Partial<Pick<User, 'firstName' | 'lastName' | 'email'>>) => {
    const updated = await authApi.updateProfile(data);
    setUser(updated);
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    await authApi.changePassword(oldPassword, newPassword);
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
