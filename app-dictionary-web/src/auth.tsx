import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { authApi, AuthResponse, setOnUnauthorized, tokens, User } from './api';

interface AuthValue {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Stores the fresh tokens the server returns after a password change. */
  adopt: (r: AuthResponse) => void;
  setUser: (u: User) => void;
}

const Ctx = createContext<AuthValue>(null as unknown as AuthValue);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => !!tokens.access());

  useEffect(() => {
    setOnUnauthorized(() => setUser(null));
    if (!tokens.access()) return;
    authApi
      .me()
      .then(setUser)
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const finishAuth = async (r: AuthResponse) => {
    tokens.save(r);
    setUser(await authApi.me());
  };

  const login = useCallback(async (username: string, password: string) => {
    await finishAuth(await authApi.login(username, password));
  }, []);

  const register = useCallback(
    async (firstName: string, lastName: string, email: string, username: string, password: string) => {
      await finishAuth(await authApi.register(firstName, lastName, email, username, password));
    },
    []
  );

  const logout = useCallback(async () => {
    const refresh = tokens.refresh();
    tokens.clear();
    setUser(null);
    authApi.logout(refresh).catch(() => undefined);
  }, []);

  const adopt = useCallback((r: AuthResponse) => tokens.save(r), []);

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout, adopt, setUser }}>{children}</Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
