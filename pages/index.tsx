import Head from 'next/head';
import { useGlobal } from '../lib/context/global';

export default function Home() {
  const { setIsOpenLoginModal } = useGlobal();

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
        <h1>É pro login já tá funcionado testa ai:</h1>
        <button onClick={() => setIsOpenLoginModal(true)}>
          Abrir modal login
        </button>
      </main>
    </div>
  );
}
