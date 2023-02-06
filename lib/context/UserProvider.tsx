import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import type { user } from '../../use-cases/users/getUserFromId';
import axios from '../utils/axios';
import getStripe from '../get-stripejs.ts';
import { toast } from 'react-toastify';
import * as gtag from '../gtag';

type AuthData = {
  email: string;
  password: string;
};

type CreateUserAuthData = AuthData & {
  utmCampaign?: string;
  utmMedium?: string;
  utmSource?: string;
};

interface IUserProvider {
  user: user;
  refreshUser: () => Promise<void>;
  createUser: (data: AuthData) => Promise<any>;
  login: (data: AuthData) => Promise<any>;
  resetPassword: (data: AuthData) => Promise<any>;
  saveResetPassword: (token: string) => Promise<any>;
  requestChangePlan: (planName: string) => Promise<any>;
  createCheckoutSession: (planName: string) => Promise<any>;
  changePlan: (sessionId: string) => Promise<any>;
  getWarnings: () => Promise<any>;
  readWarning: (warningId: string) => Promise<any>;
  getOrders: () => Promise<any>;
  createOrder: (data: { username: string; amount: number }) => Promise<any>;
  logout: () => void;
  isLoading: boolean;
}

export const UserContext = createContext({} as IUserProvider);

type ProviderProps = {
  children: ReactNode;
};

export default function UserProvider({ children }: ProviderProps) {
  const [loggedUser, setLoggedUser] = useState<user | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const createUser = useCallback(
    async ({
      email,
      password,
      utmCampaign,
      utmMedium,
      utmSource,
    }: CreateUserAuthData) => {
      try {
        setIsLoading(true);
        const response = await axios.post(
          '/api/users',
          {
            email,
            password,
            utmCampaign,
            utmMedium,
            utmSource,
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
          statusCode: response.status,
        };
      } catch (error) {
        return error.response.data;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const login = useCallback(async ({ email, password }: AuthData) => {
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
        statusCode: response.status,
      };
    } catch (error) {
      return error.response.data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async ({ password, email }: AuthData) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        '/api/users/request-password-reset',
        {
          email,
          newPassword: password,
        },
        {
          headers: {
            'no-auth': 'true',
          },
        }
      );
      const data = response.data;
      return {
        ...data,
        statusCode: response.status,
      };
    } catch (error) {
      return error.response.data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveResetPassword = useCallback(async (token: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        '/api/users/password-reset',
        {
          token,
        },
        {
          headers: {
            'no-auth': 'true',
          },
        }
      );
      const data = response.data;
      return {
        ...data,
        statusCode: response.status,
      };
    } catch (error) {
      return error.response.data;
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

  const createCheckoutSession = useCallback(async (planName: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/plans/session', {
        planName,
      });
      return response.data;
    } catch (error) {
      toast.error('Houve um erro ao buscar o plano');
      return;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestChangePlan = useCallback(async (planName: string) => {
    let sessionId: string;

    try {
      const session = await createCheckoutSession(planName);
      if (!session.id) {
        toast.error('Houve um erro ao buscar o plano');
        return;
      }

      sessionId = session.id;
    } catch (error) {
      toast.error('Houve um erro ao abrir o checkout');
      return;
    }

    try {
      const stripe = await getStripe();
      gtag.conversion('AW-11069655695/iR7uCLSI-ooYEI-Vtp4p');
      const { error } = await stripe?.redirectToCheckout({ sessionId });
      if (error) {
        throw error;
      }
    } catch (error) {
      toast.error('Houve um erro ao abrir o checkout');
      return;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changePlan = useCallback(async (sessionId: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/plans/change', {
        sessionId,
      });
      const data = response.data;
      return {
        ...data,
        statusCode: response.status,
      };
    } catch (error) {
      return error.response.data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getWarnings = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/users/warnings');
      const data = response.data;
      return {
        warnings: data,
        statusCode: response.status,
      };
    } catch (error) {
      return error.response.data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createOrder = useCallback(async ({ username, amount }) => {
    try {
      const response = await axios.post('/api/orders', {
        username,
        amount,
      });
      const data = response.data;
      return {
        order: data,
        statusCode: response.status,
      };
    } catch (error) {
      return error.response.data;
    }
  }, []);

  const getOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/orders');
      const data = response.data;
      return {
        orders: data,
        statusCode: response.status,
      };
    } catch (error) {
      return error.response.data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const readWarning = useCallback(async (warningId: string) => {
    try {
      setIsLoading(true);
      const response = await axios.put(`/api/users/warnings/${warningId}`);
      return {
        statusCode: response.status,
      };
    } catch (error) {
      return error.response.data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user: loggedUser,
        refreshUser: requestUser,
        login,
        logout,
        isLoading,
        createUser,
        resetPassword,
        saveResetPassword,
        requestChangePlan,
        changePlan,
        getWarnings,
        getOrders,
        readWarning,
        createOrder,
        createCheckoutSession,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
