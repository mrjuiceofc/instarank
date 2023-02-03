import { useRouter } from 'next/router';
import React, { ReactNode, createContext, useState, useCallback } from 'react';
import ModalCreateUser from '../components/ModalCreateUser';
import ModalLogin from '../components/ModalLogin';
import ModalResetPassword from '../components/ModalResetPassword';

interface IGlobalProvider {
  openLoginModal: () => void;
  openResetPasswordModal: () => void;
  openCreateUserModal: (plan: string) => void;
}

export const GlobalContext = createContext({} as IGlobalProvider);

type ProviderProps = {
  children: ReactNode;
};

export default function GlobalProvider({ children }: ProviderProps) {
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
  const [isOpenCreateUserModal, setIsOpenCreateUserModal] = useState(false);
  const [isOpenResetPasswordModal, setIsOpenResetPasswordModal] =
    useState(false);
  const [createUserPlan, setCreateUserPlan] = useState('free');
  const router = useRouter();

  const openCreateUserModal = useCallback(
    (plan: string) => {
      const token = localStorage.getItem('token');

      if (token) {
        router.push('/app');
        return;
      }

      setCreateUserPlan(plan);
      setIsOpenCreateUserModal(true);
    },
    [router]
  );

  return (
    <GlobalContext.Provider
      value={{
        openLoginModal: () => {
          const token = localStorage.getItem('token');

          if (token) {
            router.push('/app');
            return;
          }

          setIsOpenLoginModal(true);
        },
        openCreateUserModal,
        openResetPasswordModal: () => setIsOpenResetPasswordModal(true),
      }}
    >
      <ModalLogin
        isOpen={isOpenLoginModal}
        onClose={() => setIsOpenLoginModal(false)}
      />
      <ModalCreateUser
        isOpen={isOpenCreateUserModal}
        onClose={() => setIsOpenCreateUserModal(false)}
        plan={createUserPlan}
      />
      <ModalResetPassword
        isOpen={isOpenResetPasswordModal}
        onClose={() => setIsOpenResetPasswordModal(false)}
      />
      {children}
    </GlobalContext.Provider>
  );
}
