import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('token')));


  useEffect(() => {
    if (!localStorage.getItem('token')) return;
    api('/auth/me')
      .then(({ user: u }) => setUser(u))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const handleAuth = useCallback(({ token, user: u }) => {
    localStorage.setItem('token', token);
    setUser(u);
    return u;
  }, []);

  const login = useCallback(
    async (email, password) => handleAuth(await api('/auth/login', { method: 'POST', body: { email, password } })),
    [handleAuth]
  );
  const register = useCallback(
    async (form) => handleAuth(await api('/auth/register', { method: 'POST', body: form })),
    [handleAuth]
  );
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
