import Head from 'next/head';
import styled from 'styled-components';
import { Button } from '../lib/components/Botton';
import useAuth from '../lib/hooks/useAuth';
import useGlobal from '../lib/hooks/useGlobal';

export default function Home() {
  const { setIsOpenLoginModal } = useGlobal();
  const { user, refreshUser, logout } = useAuth();

  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Esta ferramenta ordena os posts de uma conta do Instagram em ordem de curtidas ou comentários para analisar quais publicações estão tendo maior engajamento dos usuários"
        />
        <title>
          Descubra qual a publicação mais engajada do seu concorrente |
          Instarank
        </title>
      </Head>
      <Wrapper>
        {user ? (
          <>
            <h3>Seus Dados:</h3>
            <ul>
              <li>Seu id: {user.id}</li>
              <li>Seu e-mail: {user.email}</li>
              <li>Seu ip: {user.ip}</li>
              <li>Seu limite mensal: {user.monthlyLimit}</li>
              <li>Seu plano: {user.plan.name}</li>
            </ul>
            <h3>Ações:</h3>
            <WrapperButtons>
              <Button onClick={() => refreshUser()}>
                Atualizar seus dados
              </Button>
              <Button variant="outline" onClick={() => logout()}>
                Sair
              </Button>
            </WrapperButtons>
          </>
        ) : (
          <>
            <h3>Ações:</h3>
            <WrapperButtons>
              <Button onClick={() => setIsOpenLoginModal(true)}>
                Fazer login
              </Button>
            </WrapperButtons>
          </>
        )}
      </Wrapper>
    </div>
  );
}

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const WrapperButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 400px;
  min-width: 300px;
`;
