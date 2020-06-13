import React, {
  useEffect,
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';
import AsynStorage from '@react-native-community/async-storage';

import api from '../services/api';

interface SignInCredentias {
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatarURL?: string;
}

interface AuthState {
  token?: string;
  user?: User;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthContextState {
  user?: User;
  signIn(signInCredentias: SignInCredentias): Promise<void>;
  signOut(): void;
  updateUser(user: User): Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextState>({} as AuthContextState);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post<AuthResponse>('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;
    api.defaults.headers.authorization = `Bearer ${token}`;

    await AsynStorage.multiSet([
      ['@Gobarber:token', token],
      ['@Gobarber:user', JSON.stringify(user)],
    ]);

    setData({ token, user });
  }, []);

  const signOut = useCallback(async () => {
    await AsynStorage.multiRemove(['@Gobarber:token', '@Gobarber:user']);
    setData({});
  }, []);

  const updateUser = useCallback(async (user: User) => {
    await AsynStorage.setItem('@Gobarber:user', JSON.stringify(user));

    setData(prev => ({ ...prev, user }));
  }, []);

  useEffect(() => {
    async function loadStorageData() {
      const [token, user] = await AsynStorage.multiGet([
        '@Gobarber:token',
        '@Gobarber:user',
      ]);

      if (token[1] && user[1]) {
        api.defaults.headers.authorization = `Bearer ${token[1]}`;
        setData({ token: token[1], user: JSON.parse(user[1]) });
      }

      setLoading(false);
    }

    loadStorageData();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user: data?.user, signIn, signOut, updateUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextState {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
