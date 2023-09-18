import { order as OrderType, plan, suspect, user } from '@prisma/client';
import axios from 'axios';
import { BaseError } from '../../errors';
import prisma from '../../lib/prisma';
import { smmTranslateStatus } from '../../lib/utils/smmTranslateStatus';
import { OrderFollowersDTO, SMMOrder } from './dto';

const serviceByPlan: {
  [key: string]: string;
} = {
  free: '7555',
  premium: '8118',
};

export async function orderFollowers({
  requestId,
  username,
  amount,
  userId,
}: OrderFollowersDTO) {
  if (amount < 10) {
    throw new BaseError({
      errorLocationCode: 'orderFollowers:amount',
      message: 'Quantidade de seguidores deve ser maior que 10',
      statusCode: 400,
      requestId,
    });
  }

  if (!username || username.length < 1) {
    throw new BaseError({
      errorLocationCode: 'orderFollowers:username',
      message: 'Nome de usuário inválido',
      statusCode: 400,
      requestId,
    });
  }

  username = username.replace('@', '').toLowerCase().trim();

  if (!userId || userId.length < 1) {
    throw new BaseError({
      errorLocationCode: 'orderFollowers:userId',
      message: 'Id de usuário inválido',
      statusCode: 400,
      requestId,
    });
  }

  if (!process.env.SMMENGINEER_API_KEY) {
    throw new BaseError({
      errorLocationCode: 'orderFollowers:process.env.SMMENGINEER_API_KEY',
      message: 'Chave da API do SMMEngineer não encontrada',
      statusCode: 500,
      requestId,
    });
  }

  let hasProcessingOrder: boolean;
  try {
    const existsOrder = await prisma.order.findFirst({
      where: {
        username,
        status: {
          in: ['IN_PROGRESS', 'PENDING', 'PROCESSING'],
        },
      },
    });
    hasProcessingOrder = !!existsOrder;
  } catch (error) {
    throw new BaseError({
      errorLocationCode: 'orderFollowers:prisma.order.findFirst',
      message: 'Erro desconhecido ao buscar pedido',
      statusCode: 500,
      requestId,
    });
  }

  if (hasProcessingOrder) {
    throw new BaseError({
      errorLocationCode: 'orderFollowers:prisma.order.findFirst',
      message: `Aguarde o pedido anterior para ${username} ser concluído.`,
      statusCode: 400,
      requestId,
    });
  }

  let suspect: suspect;
  try {
    suspect = await prisma.suspect.findFirst({
      where: {
        username,
      },
    });
  } catch (error) {
    throw new BaseError({
      errorLocationCode: 'orderFollowers:prisma.suspect.findUnique',
      message: 'Houve um erro ao buscar usuário',
      statusCode: 500,
      requestId,
    });
  }

  if (suspect) {
    throw new BaseError({
      errorLocationCode: 'orderFollowers:prisma.suspect.findUnique',
      message: 'Foi detectado uma ação suspeita em sua conta',
      statusCode: 400,
      requestId,
    });
  }

  let user: user & {
    plan: plan;
  };
  try {
    user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        plan: true,
      },
    });
  } catch (error) {
    throw new BaseError({
      errorLocationCode: 'orderFollowers:prisma.user.findUnique',
      message: 'Erro desconhecido ao buscar usuário',
      statusCode: 500,
      requestId,
    });
  }

  if (!user) {
    throw new BaseError({
      errorLocationCode: 'orderFollowers:prisma.user.findUnique',
      message: 'Usuário não encontrado',
      statusCode: 404,
      requestId,
    });
  }

  if (user.monthlyLimit < amount) {
    throw new BaseError({
      errorLocationCode: 'orderFollowers:prisma.user.findUnique',
      message: `Você não tem limite suficiente para adicionar ${amount} seguidores.`,
      statusCode: 400,
      requestId,
    });
  }

  const smmServiceId = serviceByPlan[user.plan.name];

  if (!smmServiceId) {
    throw new BaseError({
      errorLocationCode: 'orderFollowers:smmServiceId',
      message: 'Plano inválido',
      statusCode: 400,
      requestId,
    });
  }

  let smmOrderId: string;
  try {
    const response = await axios.get('https://smmengineer.com/api/v2', {
      params: {
        key: process.env.SMMENGINEER_API_KEY,
        action: 'add',
        service: smmServiceId,
        link: username,
        quantity: amount,
      },
    });

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    if (!response.data.order) {
      throw new Error('SMMEngineer não retornou um id de pedido');
    }

    smmOrderId = response.data.order;
  } catch (error) {
    throw new BaseError({
      errorLocationCode: 'orderFollowers:axios.get',
      message: 'Houve um erro ao enviar o pedido',
      statusCode: 500,
      requestId,
    });
  }

  let order: SMMOrder;
  try {
    const response = await axios.get('https://smmengineer.com/api/v2', {
      params: {
        key: process.env.SMMENGINEER_API_KEY,
        action: 'status',
        order: smmOrderId,
      },
    });

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    const rawOrder = response.data;

    order = {
      charge: rawOrder.charge,
      start_count: Number(rawOrder.start_count),
      status: rawOrder.status,
      remains: Number(rawOrder.remains),
      currency: rawOrder.currency,
    };
  } catch (error) {
    throw new BaseError({
      errorLocationCode: 'orderFollowers:axios.get',
      message: 'Houve um erro ao processar o pedido',
      statusCode: 500,
      requestId,
    });
  }

  let orderInDb: OrderType;
  try {
    orderInDb = await prisma.order.create({
      data: {
        amount,
        remains: order.remains,
        smmOrderId: String(smmOrderId),
        smmServiceId,
        status: smmTranslateStatus[order.status],
        username,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
    throw new BaseError({
      errorLocationCode: 'orderFollowers:prisma.order.create',
      message: 'Houve um erro ao salvar o pedido',
      statusCode: 500,
      requestId,
    });
  }

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        monthlyLimit: {
          decrement: amount,
        },
      },
    });
  } catch (error) {
    throw new BaseError({
      errorLocationCode: 'orderFollowers:prisma.user.update',
      message: 'Houve um erro ao atualizar o limite do usuário',
      statusCode: 500,
      requestId,
    });
  }

  return orderInDb;
}
