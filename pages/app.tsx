import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button } from '../lib/components/Botton';
import useAuth from '../lib/hooks/useAuth';
import prisma from '../lib/prisma';
import pxToRem from '../lib/utils/pxToRem';
import type {
  InstagramPost,
  InstagramUser,
  SortPostsByUsernameDTO,
} from '../use-cases/instagram/dto';
import DefaultPersonImage from '../assets/person.jpg';
import { TextField } from '../lib/components/TextField';
import { SelectInput } from '../lib/components/SelectInput';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { PostCard } from '../lib/components/PostCard';
import Head from 'next/head';

type Props = {
  premiumPlan: {
    id: string;
    name: string;
    price: number;
    monthlyLimit: number;
  };
};

const schema = yup.object().shape({
  username: yup.string().required(),
  postsLimit: yup.number().required(),
  sortBy: yup.string().required(),
  only: yup.string().required(),
  fromDate: yup.date().required(),
  untilDate: yup.date().required(),
});

export default function App({ premiumPlan }: Props) {
  const { user, isLoading, requestChangePlan, sortPosts, refreshUser } =
    useAuth();
  const [instagramUser, setInstagramUser] = useState<InstagramUser | null>(
    null
  );
  const [posts, setPosts] = useState<InstagramPost[] | null>(null);
  const [inputError, setInputError] = useState('');

  const route = useRouter();

  const onChangePlan = useCallback(async () => {
    await requestChangePlan(premiumPlan.name);
  }, [premiumPlan]);

  useEffect(() => {
    if (!user && !isLoading) {
      route.push('/');
    }
  }, [user, isLoading]);

  const onSubmitSort = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const body: SortPostsByUsernameDTO = Object.fromEntries(
        new FormData(event.currentTarget).entries()
      ) as any;

      body.username = body.username.replace('@', '');

      try {
        await schema.validate(body);
      } catch (error) {
        setInputError(error.path);
        return;
      }
      const id = toast.loading(
        'Aguarde enquanto ordenamos os posts, isso pode demorar até 1 minuto...'
      );

      const response = await sortPosts(body);
      await refreshUser();

      if (response.statusCode !== 200) {
        toast.update(id, {
          render: response.message,
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
        return;
      }

      if (response.data.posts.length === 0) {
        toast.update(id, {
          render: 'Nenhum post encontrado',
          type: 'warning',
          isLoading: false,
          autoClose: 3000,
        });
        return;
      }

      toast.update(id, {
        render: `${response.data.posts.length} ${
          response.data.params.only === 'reels' ? 'reels' : 'posts'
        } ordenados por ${response.data.params.sortBy} entre ${new Date(
          response.data.params.fromDate
        ).toLocaleDateString('pt-BR')} e ${new Date(
          response.data.params.untilDate
        ).toLocaleDateString('pt-BR')}`,
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });

      setInstagramUser(response.data.user);
      setPosts(response.data.posts);
    },
    []
  );

  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Esta ferramenta ordena os posts de uma conta do Instagram em ordem de curtidas ou comentários para analisar quais publicações estão tendo maior engajamento dos usuários"
        />
        <title>
          Descubra o segredo do seu concorrente no Instagram | Instarank
        </title>
      </Head>
      <Wrapper>
        <Form onSubmit={onSubmitSort}>
          <FormColumn>
            <ProfileImage
              src={instagramUser?.profileImage || DefaultPersonImage.src}
            />
            <TextField
              placeholder="Adicione o @ do usuário"
              label="Nome de usuário"
              name="username"
              error={
                inputError === 'username' && 'O nome de usuário é inválido'
              }
              onChange={async () => {
                if (inputError === 'username') {
                  setInputError('');
                }
              }}
            />
            <TextField
              placeholder="Quantos posts deseja ordenar?"
              type="number"
              name="postsLimit"
              label="Quantidade de posts"
              error={
                inputError === 'postsLimit' &&
                'A quantidade de posts é inválida'
              }
              onChange={async () => {
                if (inputError === 'postsLimit') {
                  setInputError('');
                }
              }}
            />
          </FormColumn>
          <FormColumn>
            <SelectInput
              placeholder="Selecione o tipo de ordenação"
              label="Tipo de ordenação"
              name="sortBy"
              error={
                inputError === 'sortBy' && 'O tipo de ordenação é inválido'
              }
              onChange={async () => {
                if (inputError === 'sortBy') {
                  setInputError('');
                }
              }}
            >
              <option value="likes">Likes</option>
              <option value="date">Data</option>
              <option value="comments">Comentários</option>
            </SelectInput>
            <SelectInput
              name="only"
              placeholder="Considere apenas"
              label="Considerar apenas"
              error={inputError === 'only' && 'O tipo de post é inválido'}
              onChange={async () => {
                if (inputError === 'only') {
                  setInputError('');
                }
              }}
            >
              <option value="all">Todos</option>
              <option value="posts">Posts</option>
              <option value="reels">Reels</option>
            </SelectInput>
            <TextField
              name="fromDate"
              label="A partir da data"
              type="date"
              placeholder="A partir de qual data"
              error={inputError === 'fromDate' && 'A data inicial é inválida'}
              onChange={async () => {
                if (inputError === 'fromDate') {
                  setInputError('');
                }
              }}
            />
            <TextField
              name="untilDate"
              label="Até a data"
              type="date"
              placeholder="Até qual data você deseja ordenar"
              error={inputError === 'untilDate' && 'A data final é inválida'}
              onChange={async () => {
                if (inputError === 'untilDate') {
                  setInputError('');
                }
              }}
            />

            <Button type="submit">Ordenar</Button>
          </FormColumn>
        </Form>
        <PostsWrapper>
          {!posts && (
            <p>
              Preencha o formulário acima para ordenar os posts de um usuário do
              Instagram
            </p>
          )}
          {posts && posts.length === 0 && (
            <p>Não foram encontrados posts para o usuário informado</p>
          )}
          {posts &&
            posts.length > 0 &&
            posts.map((post) => <PostCard post={post} key={post.igUrl} />)}
        </PostsWrapper>

        {user && user.plan.name === 'free' && (
          <FloatButton isLoading={isLoading} onClick={() => onChangePlan()}>
            Ordene até {premiumPlan.monthlyLimit.toLocaleString('pt-BR')} posts
          </FloatButton>
        )}
      </Wrapper>
    </div>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  text-align: center;
  padding: ${pxToRem(38)};
  gap: ${pxToRem(38)};
`;

const FloatButton = styled(Button)`
  position: fixed;
  max-width: ${pxToRem(211)};
  left: ${pxToRem(6)};
  bottom: ${pxToRem(6)};
  filter: drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.25));
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: ${pxToRem(16)};
  justify-content: center;
  width: 100%;
`;

const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${pxToRem(15)};
  width: ${pxToRem(300)};

  @media (max-width: 768px) {
    width: 100%;
    min-width: ${pxToRem(250)};
  }
`;

const ProfileImage = styled.img`
  width: ${pxToRem(142)};
  height: ${pxToRem(142)};
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.tertiary};
`;

const PostsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${pxToRem(15)};
  width: 100%;
  flex-wrap: wrap;
`;

export async function getStaticProps() {
  const plan = await prisma.plan.findFirst({
    where: {
      deletedAt: null,
      name: 'premium',
    },
  });

  return {
    props: {
      premiumPlan: {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        monthlyLimit: plan.monthlyLimit,
      },
    },
  };
}
