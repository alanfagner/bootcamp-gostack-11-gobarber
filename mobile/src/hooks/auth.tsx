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

interface AuthState {
  token?: string;
  user?: object;
}

interface AuthResponse {
  token: string;
  user: object;
}

interface AuthContextState {
  user?: object;
  signIn(signInCredentias: SignInCredentias): Promise<void>;
  signOut(): void;
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

  useEffect(() => {
    async function loadStorageData() {
      const [token, user] = await AsynStorage.multiGet([
        '@Gobarber:token',
        '@Gobarber:user',
      ]);

      if (token[1] && user[1]) {
        setData({ token: token[1], user: JSON.parse(user[1]) });
      }

      setLoading(false);
    }

    loadStorageData();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user: data?.user, signIn, signOut, loading }}
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
