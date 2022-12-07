import { useContext } from 'react';
import { ModalResetPasswordContext } from './context';

export default function useModalResetPassword() {
  const context = useContext(ModalResetPasswordContext);
  if (!context) {
    throw new Error(
      'useModalResetPassword must be used within a ModalResetPasswordProvider'
    );
  }
  return context;
}
