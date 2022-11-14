import React, { ReactNode, createContext, useState, useContext } from 'react';
import ModalLogin from '../components/ModalLogin';

type Global = {
  isOpenLoginModal: boolean;
  setIsOpenLoginModal: (isOpen: boolean) => void;
};

export const GlobalContext = createContext({} as Global);

type ProviderProps = {
  children: ReactNode;
};

export const GlobalContextProvider = ({ children }: ProviderProps) => {
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);

  return (
    <GlobalContext.Provider
      value={{
        isOpenLoginModal,
        setIsOpenLoginModal,
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
