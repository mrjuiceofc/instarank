import React, {
  ReactNode,
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import type { user } from '../../use-cases/users/getUserFromId';
import ModalLogin from '../components/ModalLogin';

type Global = {
  isOpenLoginModal: boolean;
  setIsOpenLoginModal: (isOpen: boolean) => void;
  user: user;
  refreshUser: () => Promise<void>;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
};

export const GlobalContext = createContext({} as Global);

type ProviderProps = {
  children: ReactNode;
};

export const GlobalContextProvider = ({ children }: ProviderProps) => {
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
  const [loggedUser, setLoggedUser] = useState<user | null>(null);

  const requestUser = useCallback(async () => {
    setLoggedUser(null);
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    const response = await fetch('/api/users/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 401) {
      localStorage.removeItem('token');
      return;
    }
    const userJson = await response.json();
    setLoggedUser(userJson);
    localStorage.setItem('user', JSON.stringify(userJson));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setLoggedUser(null);
  }, []);

  const login = useCallback((token: string, refreshToken: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    requestUser();
  }, []);

  useEffect(() => {
    const userLocal = localStorage.getItem('user');
    if (userLocal) {
      setLoggedUser(JSON.parse(userLocal));
      return;
    }
    requestUser();
  }, [requestUser]);

  return (
    <GlobalContext.Provider
      value={{
        isOpenLoginModal,
        setIsOpenLoginModal,
        user: loggedUser,
        refreshUser: requestUser,
        login,
        logout,
      }}
    >
      <ModalLogin
        isOpen={isOpenLoginModal}
        onClose={() => setIsOpenLoginModal(false)}
      />
      {children}
    </GlobalContext.Provider>
  );
};

export function useGlobal() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobal must be used within a GlobalContextProvider');
  }
  return context;
}
