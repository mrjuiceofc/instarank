import Head from 'next/head';
import { useGlobal } from '../lib/context/global';

export default function Home() {
  const { setIsOpenLoginModal, user, refreshUser, logout } = useGlobal();

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
      <main>
        {user ? (
          <>
            <h1>Seus Dados:</h1>
            <ul>
              <li>Seu id: {user.id}</li>
              <li>Seu e-mail: {user.email}</li>
              <li>Seu ip: {user.ip}</li>
              <li>Seu limite mensal: {user.monthlyLimit}</li>
              <li>Seu plano: {user.plan.name}</li>
            </ul>
            <button onClick={() => refreshUser()}>Atualizar seus dados</button>
            <button onClick={() => logout()}>Sair</button>
          </>
        ) : (
          <>
            <h1>Faça login:</h1>
            <button onClick={() => setIsOpenLoginModal(true)}>
              Abrir modal login
            </button>
          </>
        )}
      </main>
    </div>
  );
}
