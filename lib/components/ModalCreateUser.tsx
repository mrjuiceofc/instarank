import styled, { css } from 'styled-components';
import { Logo } from './Logo';
import Modal from './Modal';
import { TextField } from './TextField';
import { useCallback, useState } from 'react';
import { Button } from './Botton';
import * as yup from 'yup';
import pxToRem from '../utils/pxToRem';
import { Error } from './globalstyles';
import useUser from '../hooks/useUser';
import useGlobal from '../hooks/useGlobal';
import * as gtag from '../gtag';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  plan?: string;
};

const schema = yup.object().shape({
  email: yup.string().email().min(3).max(255).required(),
  password: yup.string().min(6).max(255).required(),
});

export default function ModalCreateUser({
  isOpen,
  onClose: defaultOnClose,
  plan = 'free',
}: Props) {
  const [inputError, setInputError] = useState('');
  const [globalError, setGlobalError] = useState('');
  const { createUser, requestChangePlan } = useUser();
  const [passwordValue, setPasswordValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { openLoginModal } = useGlobal();

  const onClose = useCallback(() => {
    setInputError('');
    setGlobalError('');
    setPasswordValue('');
    setEmailValue('');
    defaultOnClose();
  }, []);

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      setIsLoading(true);
      event.preventDefault();
      const utmSource = localStorage.getItem('utmSource');
      const utmMedium = localStorage.getItem('utmMedium');
      const utmCampaign = localStorage.getItem('utmCampaign');

      const body = {
        email: event.currentTarget.email.value,
        password: event.currentTarget.password.value,
        utmCampaign,
        utmMedium,
        utmSource,
      };
      try {
        await schema.validate(body);
      } catch (error) {
        setInputError(error.path);
        setIsLoading(false);
        return;
      }

      try {
        const data = await createUser(body);
        if (data.statusCode !== 201) {
          setGlobalError(data.message);
          setIsLoading(false);
          return;
        }

        localStorage.removeItem('utmSource');
        localStorage.removeItem('utmMedium');
        localStorage.removeItem('utmCampaign');

        gtag.conversion('AW-11069655695/dKZYCN3p84gYEI-Vtp4p');

        if (plan === 'free') {
          setIsLoading(false);
          onClose();
          return;
        }

        requestChangePlan(plan);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    },
    [plan]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Wrapper>
        <Logo customText="Criar conta" />
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
              'A senha deve ter no mínimo 6 caracteres'
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
            Criar conta
          </Button>
        </Form>

        <LoginAccount
          onClick={() => {
            openLoginModal();
            onClose();
          }}
        >
          Caso já tenha uma conta click aqui!
        </LoginAccount>
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

const LoginAccount = styled.span`
  ${({ theme }) => css`
    color: ${theme.colors.secondary};
    font-size: ${theme.text.detail.fontSize};
    line-height: ${theme.text.detail.lineHeight};
    font-weight: ${theme.text.detail.fontWeight};
    cursor: pointer;
  `}
`;
