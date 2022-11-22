import React, { ReactNode, createContext, useState, useCallback } from 'react';
import ModalCreateUser from '../components/ModalCreateUser';
import ModalLogin from '../components/ModalLogin';

interface IGlobalProvider {
  openLoginModal: () => void;
  openCreateUserModal: (plan: string) => void;
}

export const GlobalContext = createContext({} as IGlobalProvider);

type ProviderProps = {
  children: ReactNode;
};

export default function GlobalProvider({ children }: ProviderProps) {
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
  const [isOpenCreateUserModal, setIsOpenCreateUserModal] = useState(false);
  const [createUserPlan, setCreateUserPlan] = useState('free');

  const openCreateUserModal = useCallback((plan: string) => {
    setCreateUserPlan(plan);
    setIsOpenCreateUserModal(true);
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        openLoginModal: () => setIsOpenLoginModal(true),
        openCreateUserModal,
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
      {children}
    </GlobalContext.Provider>
  );
}
