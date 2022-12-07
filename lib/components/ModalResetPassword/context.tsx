import { createContext, ReactNode, useCallback, useState } from 'react';

interface IModalResetPasswordContext {
  onClose: () => void;
  step: 'reset' | 'success';
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setInputError: React.Dispatch<React.SetStateAction<string>>;
  setStep: React.Dispatch<
    React.SetStateAction<IModalResetPasswordContext['step']>
  >;
  setGlobalError: React.Dispatch<React.SetStateAction<string>>;
  globalError: string;
  inputError: string;
  emailValue: string;
  setEmailValue: React.Dispatch<React.SetStateAction<string>>;
  passwordValue: string;
  setPasswordValue: React.Dispatch<React.SetStateAction<string>>;
}

export const ModalResetPasswordContext = createContext(
  {} as IModalResetPasswordContext
);

type ProviderProps = {
  children: ReactNode;
  defaultOnClose: () => void;
};

export default function ModalResetPasswordProvider({
  children,
  defaultOnClose,
}: ProviderProps) {
  const [inputError, setInputError] = useState('');
  const [globalError, setGlobalError] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<IModalResetPasswordContext['step']>('reset');

  const onClose = useCallback(() => {
    setInputError('');
    setGlobalError('');
    setPasswordValue('');
    setEmailValue('');
    defaultOnClose();
  }, []);

  return (
    <ModalResetPasswordContext.Provider
      value={{
        onClose,
        step,
        setStep,
        isLoading,
        setIsLoading,
        setInputError,
        setGlobalError,
        globalError,
        inputError,
        emailValue,
        setEmailValue,
        passwordValue,
        setPasswordValue,
      }}
    >
      {children}
    </ModalResetPasswordContext.Provider>
  );
}
