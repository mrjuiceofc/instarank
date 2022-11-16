import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import type { user } from '../../use-cases/users/getUserFromId';
import axios from '../utils/axios';

type LoginData = {
  email: string;
  password: string;
};

interface IAuthProvider {
  user: user;
  refreshUser: () => Promise<void>;
  login: (data: LoginData) => Promise<any>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext({} as IAuthProvider);

type ProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({ children }: ProviderProps) {
  const [loggedUser, setLoggedUser] = useState<user | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/users/me');
      const userJson = response.data;
      setLoggedUser(userJson);
    } catch (error) {
      setLoggedUser(null);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async ({ email, password }: LoginData) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        '/api/users/auth',
        {
          email,
          password,
        },
        {
          headers: {
            'no-auth': 'true',
          },
        }
      );
      const data = response.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      await requestUser();
      return {
        ...data,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error.response.data,
        status: error.response.status,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setIsLoading(true);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setLoggedUser(null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    requestUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: loggedUser,
        refreshUser: requestUser,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
