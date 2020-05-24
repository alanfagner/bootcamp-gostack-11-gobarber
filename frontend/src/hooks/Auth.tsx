import React, { createContext, useCallback, useState, useContext } from 'react';

import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatarURL: string;
}
interface SignInCredentias {
  email: string;
  password: string;
}

interface AuthState {
  token?: string;
  user?: User;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthContextProps {
  user?: User;
  signIn(signInCredentias: SignInCredentias): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@Gobarber:token');
    const user = localStorage.getItem('@Gobarber:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { token, user: JSON.parse(user) };
    }

    return {};
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post<AuthResponse>('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem('@Gobarber:token', token);
    localStorage.setItem('@Gobarber:user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@Gobarber:token');
    localStorage.removeItem('@Gobarber:user');
    setData({});
  }, []);

  const updateUser = useCallback((user: User) => {
    localStorage.setItem('@Gobarber:user', JSON.stringify(user));

    setData(prev => ({ ...prev, user }));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user: data?.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextProps {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
