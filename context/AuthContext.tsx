
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Role } from '../types';
import { loginMock } from '../services/mockData';

interface AuthContextType {
  user: User | null;
  login: (username: string, password?: string, remember?: boolean) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check both storages
    const storedUserLocal = localStorage.getItem('wms_user');
    const storedUserSession = sessionStorage.getItem('wms_user');
    
    if (storedUserLocal) {
      setUser(JSON.parse(storedUserLocal));
    } else if (storedUserSession) {
      setUser(JSON.parse(storedUserSession));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password?: string, remember: boolean = false) => {
    setIsLoading(true);
    try {
      const foundUser = await loginMock(username, password);
      if (foundUser) {
        setUser(foundUser);
        if (remember) {
            localStorage.setItem('wms_user', JSON.stringify(foundUser));
        } else {
            sessionStorage.setItem('wms_user', JSON.stringify(foundUser));
        }
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wms_user');
    sessionStorage.removeItem('wms_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
