import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { Button } from '../lib/components/Botton';
import useUser from '../lib/hooks/useUser';
import prisma from '../lib/prisma';
import pxToRem from '../lib/utils/pxToRem';

import * as yup from 'yup';
import Head from 'next/head';
import { TextField } from '../lib/components/TextField';
import { toast } from 'react-toastify';
import type { order_status } from '@prisma/client';

type Props = {
  premiumPlan: {
    id: string;
    name: string;
    price: number;
    monthlyLimit: number;
  };
};

type StatusTranslate = {
  [key in order_status]: string;
};

const statusTranslate: StatusTranslate = {
  PENDING: 'Pendente',
  PROCESSING: 'Processando',
  PARTIAL: 'Parcialmente concluída',
  COMPLETED: 'Concluída',
  CANCELLED: 'Cancelada',
  FAILED: 'Falhou',
  IN_PROGRESS: 'Em progresso',
};

export default function App({ premiumPlan }: Props) {
  const {
    user,
    isLoading,
    requestChangePlan,
    getOrders,
    createOrder,
    refreshUser,
    createCheckoutSession,
  } = useUser();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [inputError, setInputError] = useState({
    username: '',
    amount: '',
  });
  const [schema, setSchema] = useState<any>(yup.object().shape({}));
  const [limitResetDate, setLimitResetDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!user) return;

    const lastResetDate = new Date(user.limitResetAt);
    const nextResetDate = new Date(
      lastResetDate.setMonth(lastResetDate.getMonth() + 1)
    );
    setLimitResetDate(nextResetDate);
  }, [user]);

  const route = useRouter();

  const onChangePlan = useCallback(async () => {
    await requestChangePlan(premiumPlan.name);
  }, [premiumPlan]);

  const getOrdersList = useCallback(async () => {
    if (!user) {
      return;
    }

    const response = await getOrders();

    if (response.statusCode !== 200) {
      toast.error(response.message);
      return;
    }

    setOrders(response.orders);
  }, [user]);

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const body = new FormData(event.currentTarget);
      const data = Object.fromEntries(body.entries());

      try {
        await schema.validate({
          username: data.username,
          amount: Number(data.amount),
        });
      } catch (error) {
        setInputError({
          username: error.path === 'username' ? error.message : '',
          amount: error.path === 'amount' ? error.message : '',
        });
        return;
      }

      setIsLoadingOrders(true);
      const response = await createOrder(data as any);
      await refreshUser();
      await getOrdersList();
      setIsLoadingOrders(false);

      if (response.statusCode !== 200) {
        toast.error(response.message);
        return;
      }

      toast.success('Pedido enviado com sucesso!');
    },
    [schema]
  );

  useEffect(() => {
    if (!user && !isLoading) {
      route.push('/');
    }
  }, [user, isLoading]);

  const handleObjShape = useCallback(async () => {
    const objShape: any = {
      username: yup
        .string()
        .min(3, 'Usuário deve ter no mínimo 3 caracteres')
        .max(30, 'Usuário deve ter no máximo 30 caracteres')
        .required('Usuário é obrigatório'),
    };

    if (user.monthlyLimit > 10) {
      objShape.amount = yup
        .number()
        .min(10, 'Quantidade deve ser no mínimo 10')
        .max(
          user.monthlyLimit,
          `O seu limite até o fim do mês é de ${user.monthlyLimit.toLocaleString(
            'pt-BR'
          )} seguidores`
        )
        .required('Quantidade é obrigatória');
    }

    if (user.monthlyLimit < 10 && user.plan.name === 'premium') {
      objShape.amount = yup
        .number()
        .max(
          0,
          `Sua quantidade de seguidores mensal acabou ou é menor que 10. Volte aqui a partir do dia ${limitResetDate?.toLocaleDateString(
            'pt-BR'
          )} que você terá ${user.plan.monthlyLimit.toLocaleString(
            'pt-BR'
          )} seguidores para fazer um pedido.`
        )
        .required('Quantidade é obrigatória');
    }

    if (user.monthlyLimit < 10 && user.plan.name === 'free') {
      let text =
        'Sua quantidade de seguidores mensal acabou ou é menor que 10.';

      const session = await createCheckoutSession(premiumPlan.name);

      if (session.url) {
        text = `${text} <a href="${session.url}">Click aqui</a>`;
      } else {
        text = `${text} Click no botão abaixo "Ganhe ${premiumPlan.monthlyLimit.toLocaleString(
          'pt-BR'
        )} seguidores todos os meses"`;
      }

      text = `${text} para adquirir ${premiumPlan.monthlyLimit.toLocaleString(
        'pt-BR'
      )} seguidores todos os meses por apenas ${(
        premiumPlan.price / 100
      ).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })}`;

      objShape.amount = yup
        .number()
        .max(0, text)
        .required('Quantidade é obrigatória');
    }

    setSchema(yup.object().shape({ ...objShape }));
  }, [user, limitResetDate, premiumPlan]);

  useEffect(() => {
    if (!user || !limitResetDate) return;

    handleObjShape();
  }, [user, limitResetDate, handleObjShape]);

  useEffect(() => {
    if (!user) {
      return;
    }

    getOrdersList();
  }, [getOrdersList, user]);

  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Aumente sua base de seguidores no Instagram com nossa ferramenta de seguidores, escolha a quantidade desejada sem limitações e deixe que cuidemos disso por você. Experimente agora e veja a diferença na sua presença online!"
        />
        <title>
          10 mil seguidores extras todo mês no Instagram | Instarank
        </title>
      </Head>
      <Wrapper>
        <Form onSubmit={onSubmit}>
          <TextField
            name="username"
            label="Usuário"
            placeholder="Digite o nome de usuário"
            type="text"
            error={inputError.username}
            onChange={() => {
              setInputError((old) => ({
                ...old,
                username: '',
              }));
            }}
          />
          <TextField
            name="amount"
            label="Quantidade"
            placeholder="Digite a quantidade de seguidores"
            type="number"
            error={inputError.amount}
            onChange={() => {
              setInputError((old) => ({
                ...old,
                amount: '',
              }));
            }}
          />
          <Button
            isLoading={isLoadingOrders}
            disabled={isLoadingOrders}
            type="submit"
          >
            Enviar seguidores
          </Button>
        </Form>
        <MyOrders>
          <h2>Meus pedidos</h2>
          {orders.length === 0 && (
            <p>
              Você ainda não fez nenhum pedido, faça um pedido de seguidores
              agora!
            </p>
          )}
          {orders.length > 0 && (
            <WrapperOrders>
              {orders.map((order) => (
                <OrderCard key={order.id}>
                  <p>
                    <strong>Usuário:</strong> {order.username}
                  </p>
                  <p>
                    <strong>Quantidade:</strong>{' '}
                    {order.amount.toLocaleString('pt-BR')}
                  </p>
                  <p>
                    <strong>Status:</strong> {statusTranslate[order.status]}
                  </p>
                  <p>
                    <strong>Restante:</strong>{' '}
                    {order.remains.toLocaleString('pt-BR')}
                  </p>
                  <p>
                    <strong>Criado em:</strong>{' '}
                    {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </OrderCard>
              ))}
            </WrapperOrders>
          )}
        </MyOrders>
        {user && user.plan.name === 'free' && (
          <FloatButton isLoading={isLoading} onClick={() => onChangePlan()}>
            Assine {premiumPlan.monthlyLimit.toLocaleString('pt-BR')} seguidores
            por{' '}
            {(premiumPlan.price / 100).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
            /mês
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
  padding: ${pxToRem(50)};
  gap: ${pxToRem(38)};

  @media (max-width: 768px) {
    padding: ${pxToRem(10)};
    margin-top: ${pxToRem(38)};
  }
`;

const MyOrders = styled.section`
  width: 100%;
`;

const FloatButton = styled(Button)`
  position: fixed;
  bottom: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: ${pxToRem(16)};
  border-top-right-radius: ${pxToRem(16)};
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: ${pxToRem(16)};
  justify-content: center;
  width: 100%;
  max-width: ${pxToRem(640)};
`;

const WrapperOrders = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${pxToRem(16)};
  justify-content: center;
  width: 100% !important;
`;

const OrderCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${pxToRem(16)};
  padding: ${pxToRem(16)};
  border-radius: ${pxToRem(16)};
  background-color: ${({ theme }) => theme.colors.tertiaryLight};
  align-items: flex-start;
  width: ${pxToRem(400)};

  @media (max-width: 768px) {
    width: 100% !important;
  }

  p {
    margin: 0;
  }
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
