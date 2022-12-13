import Head from 'next/head';
import styled from 'styled-components';
import { Button } from '../lib/components/Botton';
import { Loading } from '../lib/components/globalstyles';
import useAuth from '../lib/hooks/useAuth';

export default function Home() {
  const { user, refreshUser, logout, isLoading: authIsLoading } = useAuth();

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
        <WrapperText>
          <h1>Olá!</h1>
          <p>
            Atualmente o Instarank ainda está em desenvolvimento. Por tanto
            espero que tenha paciência até o lançamento oficial do site. Quando
            isso acontecer você finalmente verá quais são as postagens mais
            engajadas dos seus concorrentes no Instagram!
          </p>
        </WrapperText>

        {user && !authIsLoading && (
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
        )}
        {authIsLoading && (
          <>
            <h3>Carregando...</h3>
            <Loading />
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
  padding-bottom: 50px;
`;

const WrapperText = styled.div`
  max-width: 400px;
  text-align: center;
`;

const WrapperButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 400px;
  min-width: 300px;
`;
