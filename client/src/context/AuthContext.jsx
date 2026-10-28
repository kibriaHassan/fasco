import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import api, { TOKEN_KEY } from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistToken = useCallback((token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      localStorage.removeItem(TOKEN_KEY);
      delete api.defaults.headers.common.Authorization;
    }
  }, []);

  const fetchMe = useCallback(async () => {
    const { data } = await api.get('/auth/me');
    setUser(data.user);
    return data.user;
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    (async () => {
      try {
        if (token) {
          await fetchMe();
        }
      } catch {
        persistToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchMe, persistToken]);

  const login = useCallback(
    async (email, password) => {
      const { data } = await api.post('/auth/login', { email, password });
      persistToken(data.token);
      setUser(data.user);
      return data;
    },
    [persistToken],
  );

  const register = useCallback(
    async (payload) => {
      const { data } = await api.post('/auth/register', payload);
      persistToken(data.token);
      setUser(data.user);
      return data;
    },
    [persistToken],
  );

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      /* ignore network errors on logout */
    } finally {
      persistToken(null);
      setUser(null);
    }
  }, [persistToken]);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user, loading, login, register, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
