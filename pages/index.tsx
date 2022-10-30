import Head from 'next/head';

export default function Home() {
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
      <h1>Olá mundo!</h1>
    </div>
  );
}
