import styled, { css } from 'styled-components';
import { Logo } from './Logo';
import Modal from './Modal';
import { TextField } from './TextField';
import { useCallback, useRef, useState } from 'react';
import { Button } from './Botton';
import * as yup from 'yup';
import YupPassword from 'yup-password';
import pxToRem from '../utils/pxToRem';
import { Error } from './globalstyles';
import { useGlobal } from '../context/global';
YupPassword(yup);

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const schema = yup.object().shape({
  email: yup.string().email().min(3).max(255).required(),
  password: yup.string().password(),
});

export default function ModalLogin({ isOpen, onClose: defaultOnClose }: Props) {
  const [inputError, setInputError] = useState('');
  const [globalError, setGlobalError] = useState('');
  const { login } = useGlobal();
  const [passwordValue, setPasswordValue] = useState('');
  const [emailValue, setEmailValue] = useState('');

  const onClose = useCallback(() => {
    setInputError('');
    setGlobalError('');
    setPasswordValue('');
    setEmailValue('');
    defaultOnClose();
  }, []);

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const body = {
        email: event.currentTarget.email.value,
        password: event.currentTarget.password.value,
      };
      try {
        await schema.validate(body);
      } catch (error) {
        setInputError(error.path);
        return;
      }
      try {
        const response = await fetch('/api/users/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (response.status === 403) {
          setGlobalError('O email ou a senha estão incorretos');
          return;
        }
        if (response.status === 500) {
          setGlobalError(
            'Ocorreu um erro interno no servidor, tente novamente mais tarde'
          );
          return;
        }

        if (response.status === 201) {
          login(data.token, data.refreshToken);
          onClose();
        }
      } catch (error) {
        console.log(error);
      }
    },
    []
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Wrapper>
        <Logo />
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
            placeholder="Digite sua senha"
            type="password"
            value={passwordValue}
            error={
              inputError === 'password' &&
              'A senha deve ter ter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial'
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
          <Button variant="gradient" type="submit">
            Login
          </Button>
        </Form>

        <ForgotPassword>Esqueceu a senha?</ForgotPassword>
        <Line />
        <CreateAccount>Caso ainda tenha uma conta click aqui!</CreateAccount>
      </Wrapper>
    </Modal>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${pxToRem(20)};
  width: 100%;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ForgotPassword = styled.span`
  ${({ theme }) => css`
    color: ${theme.text.detail.color};
    font-size: ${theme.text.detail.fontSize};
    line-height: ${theme.text.detail.lineHeight};
    font-weight: ${theme.text.detail.fontWeight};
    cursor: pointer;
  `}
`;

const Line = styled.div`
  ${({ theme }) => css`
    width: ${pxToRem(60)};
    height: ${pxToRem(1)};
    background-color: ${theme.colors.tertiary};
  `}
`;

const CreateAccount = styled.span`
  ${({ theme }) => css`
    color: ${theme.colors.secondary};
    font-size: ${theme.text.detail.fontSize};
    line-height: ${theme.text.detail.lineHeight};
    font-weight: ${theme.text.detail.fontWeight};
    cursor: pointer;
  `}
`;
