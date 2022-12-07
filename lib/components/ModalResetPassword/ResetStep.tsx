import { Button } from '../Botton';
import { Error } from '../globalstyles';
import useAuth from '../../hooks/useAuth';
import useGlobal from '../../hooks/useGlobal';
import { useCallback, useState } from 'react';
import { TextField } from '../TextField';
import * as yup from 'yup';
import YupPassword from 'yup-password';
import { Logo } from '../Logo';
import styled, { css } from 'styled-components';
import useModalResetPassword from './hook';

YupPassword(yup);

const schema = yup.object().shape({
  email: yup.string().email().min(3).max(255).required(),
  password: yup.string().password(),
});

export default function ResetStep() {
  const { resetPassword } = useAuth();
  const { openLoginModal } = useGlobal();
  const {
    setIsLoading,
    setInputError,
    setStep,
    setGlobalError,
    globalError,
    inputError,
    emailValue,
    setEmailValue,
    passwordValue,
    setPasswordValue,
    isLoading,
    onClose,
  } = useModalResetPassword();

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      setIsLoading(true);
      event.preventDefault();
      const body = {
        email: event.currentTarget.email.value,
        password: event.currentTarget.password.value,
      };
      try {
        await schema.validate(body);
      } catch (error) {
        setInputError(error.path);
        setIsLoading(false);
        return;
      }
      try {
        const data = await resetPassword(body);
        if (data.statusCode !== 200) {
          setGlobalError(data.message);
          setIsLoading(false);
          return;
        }

        setIsLoading(false);
        setStep('success');
      } catch (error) {
        console.log(error);
      }
    },
    []
  );

  return (
    <>
      <Logo customText="Redefinir senha" />
      <Form onSubmit={onSubmit}>
        <TextField
          name="email"
          placeholder="Digite seu email"
          value={emailValue}
          error={
            inputError === 'email' &&
            'Parece que o e-mail informado não é valido'
          }
          onChange={(e) => {
            setEmailValue(e.target.value);
            if (inputError === 'email') {
              setInputError('');
            }
            setGlobalError('');
          }}
        />
        <TextField
          name="password"
          placeholder="Digite sua nova senha"
          type="password"
          value={passwordValue}
          error={
            inputError === 'password' &&
            'A nova senha deve ter ter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial'
          }
          onChange={(e) => {
            setPasswordValue(e.target.value);
            if (inputError === 'password') {
              setInputError('');
            }
            setGlobalError('');
          }}
        />
        {globalError && <Error>{globalError}</Error>}
        <Button isLoading={isLoading} variant="gradient" type="submit">
          Redefinir senha
        </Button>
      </Form>

      <LoginAccount
        onClick={() => {
          openLoginModal();
          onClose();
        }}
      >
        Se lembrou da senha?
      </LoginAccount>
    </>
  );
}

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const LoginAccount = styled.span`
  ${({ theme }) => css`
    color: ${theme.colors.secondary};
    font-size: ${theme.text.detail.fontSize};
    line-height: ${theme.text.detail.lineHeight};
    font-weight: ${theme.text.detail.fontWeight};
    cursor: pointer;
  `}
`;
