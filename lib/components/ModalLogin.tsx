import styled, { css } from 'styled-components';
import { Logo } from './Logo';
import Modal from './Modal';
import { TextField } from './TextField';
import { useCallback, useEffect, useState } from 'react';
import { Button } from './Botton';
import * as yup from 'yup';
import pxToRem from '../utils/pxToRem';
import { Error } from './globalstyles';
import useAuth from '../hooks/useAuth';
import useGlobal from '../hooks/useGlobal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const schema = yup.object().shape({
  email: yup.string().email().min(3).max(255).required(),
  password: yup.string(),
});

export default function ModalLogin({ isOpen, onClose: defaultOnClose }: Props) {
  const [inputError, setInputError] = useState('');
  const [globalError, setGlobalError] = useState('');
  const { login } = useAuth();
  const [passwordValue, setPasswordValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { openCreateUserModal, openResetPasswordModal } = useGlobal();
  const { user } = useAuth();

  const onClose = useCallback(() => {
    setInputError('');
    setGlobalError('');
    setPasswordValue('');
    setEmailValue('');
    defaultOnClose();
  }, []);

  useEffect(() => {
    if (user && !isLoading) {
      onClose();
    }
  }, [user, onClose, isLoading]);

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
        const data = await login(body);
        if (data.statusCode !== 201) {
          setGlobalError(data.message);
          setIsLoading(false);
          return;
        }
        setIsLoading(false);
        onClose();
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    },
    []
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Wrapper>
        <Logo customText="Login" />
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
          <Button isLoading={isLoading} variant="gradient" type="submit">
            Login
          </Button>
        </Form>

        <ForgotPassword
          onClick={() => {
            openResetPasswordModal();
            onClose();
          }}
        >
          Esqueceu a senha?
        </ForgotPassword>
        <Line />
        <CreateAccount
          onClick={() => {
            openCreateUserModal('premium');
            onClose();
          }}
        >
          Caso ainda não tenha uma conta click aqui!
        </CreateAccount>
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
