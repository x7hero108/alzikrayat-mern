import { createContext, useContext, useState } from 'react';
import { STORAGE_KEY } from '../api.js';

const AuthContext = createContext(null);

const LAST_LOGIN_KEY = 'alzikrayatLastLogin';

const loadUser = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
};

// Keeps the logged-in user in React state (and in localStorage so a refresh keeps the session)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  const login = (userData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  // "last login" information (was a cookie in the PHP version)
  const getLastLogin = () => localStorage.getItem(LAST_LOGIN_KEY);
  const saveLastLogin = () => localStorage.setItem(LAST_LOGIN_KEY, new Date().toLocaleString());

  return (
    <AuthContext.Provider value={{ user, login, logout, getLastLogin, saveLastLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
