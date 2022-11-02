import Head from 'next/head';
import Modal from '../lib/components/modal';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isOpenBigModal, setIsOpenBigModal] = useState(false);
  const [isOpenSmallModal, setIsOpenSmallModal] = useState(false);

  useEffect(() => {
    console.log('isOpenBigModal', isOpenBigModal);
  }, [isOpenBigModal]);

  useEffect(() => {
    console.log('isOpenSmallModal', isOpenSmallModal);
  }, [isOpenSmallModal]);

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
        <h1>Olá Mundo</h1>
        <button onClick={() => setIsOpenBigModal(true)}>
          Abrir Modal Grande
        </button>
        <button onClick={() => setIsOpenSmallModal(true)}>
          Abrir Modal Pequeno
        </button>
        <Modal
          onClose={() => {
            setIsOpenBigModal(false);
          }}
          isOpen={isOpenBigModal}
        >
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste,
            exercitationem quisquam recusandae, eveniet iure porro, accusantium
            minima atque quas consequuntur temporibus? Et nulla eum consequuntur
            adipisci reiciendis quibusdam id? Eveniet.
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste,
            exercitationem quisquam recusandae, eveniet iure porro, accusantium
            minima atque quas consequuntur temporibus? Et nulla eum consequuntur
            adipisci reiciendis quibusdam id? Eveniet.
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste,
            exercitationem quisquam recusandae, eveniet iure porro, accusantium
            minima atque quas consequuntur temporibus? Et nulla eum consequuntur
            adipisci reiciendis quibusdam id? Eveniet.
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste,
            exercitationem quisquam recusandae, eveniet iure porro, accusantium
            minima atque quas consequuntur temporibus? Et nulla eum consequuntur
            adipisci reiciendis quibusdam id? Eveniet.
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste,
            exercitationem quisquam recusandae, eveniet iure porro, accusantium
            minima atque quas consequuntur temporibus? Et nulla eum consequuntur
            adipisci reiciendis quibusdam id? Eveniet.
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste,
            exercitationem quisquam recusandae, eveniet iure porro, accusantium
            minima atque quas consequuntur temporibus? Et nulla eum consequuntur
            adipisci reiciendis quibusdam id? Eveniet.
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste,
            exercitationem quisquam recusandae, eveniet iure porro, accusantium
            minima atque quas consequuntur temporibus? Et nulla eum consequuntur
            adipisci reiciendis quibusdam id? Eveniet.
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste,
            exercitationem quisquam recusandae, eveniet iure porro, accusantium
            minima atque quas consequuntur temporibus? Et nulla eum consequuntur
            adipisci reiciendis quibusdam id? Eveniet.
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste,
            exercitationem quisquam recusandae, eveniet iure porro, accusantium
            minima atque quas consequuntur temporibus? Et nulla eum consequuntur
            adipisci reiciendis quibusdam id? Eveniet.
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste,
            exercitationem quisquam recusandae, eveniet iure porro, accusantium
            minima atque quas consequuntur temporibus? Et nulla eum consequuntur
            adipisci reiciendis quibusdam id? Eveniet.
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste,
            exercitationem quisquam recusandae, eveniet iure porro, accusantium
            minima atque quas consequuntur temporibus? Et nulla eum consequuntur
            adipisci reiciendis quibusdam id? Eveniet.
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste,
            exercitationem quisquam recusandae, eveniet iure porro, accusantium
            minima atque quas consequuntur temporibus? Et nulla eum consequuntur
            adipisci reiciendis quibusdam id? Eveniet.
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste,
            exercitationem quisquam recusandae, eveniet iure porro, accusantium
            minima atque quas consequuntur temporibus? Et nulla eum consequuntur
            adipisci reiciendis quibusdam id? Eveniet.
          </p>
        </Modal>

        <Modal
          isOpen={isOpenSmallModal}
          onClose={() => setIsOpenSmallModal(false)}
        >
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste,
            exercitationem quisquam recusandae, eveniet iure porro, accusantium
            minima atque quas consequuntur temporibus? Et nulla eum consequuntur
            adipisci reiciendis quibusdam id? Eveniet. adipisci reiciendis
            quibusdam id? Eveniet. adipisci reiciendis quibusdam id? Eveniet.
          </p>
        </Modal>
      </main>
    </div>
  );
}
