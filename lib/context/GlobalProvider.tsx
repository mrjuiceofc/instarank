import React, {
  ReactNode,
  createContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import ModalLogin from '../components/ModalLogin';

interface IGlobalProvider {
  isOpenLoginModal: boolean;
  setIsOpenLoginModal: (isOpen: boolean) => void;
}

export const GlobalContext = createContext({} as IGlobalProvider);

type ProviderProps = {
  children: ReactNode;
};

export default function GlobalProvider({ children }: ProviderProps) {
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
}
