import { order } from '@prisma/client';
import { BaseError } from '../../errors';
import prisma from '../../lib/prisma';
import { FindOrdersByUserIdDTO } from './dto';

export async function findOrdersByUserId({
  requestId,
  userId,
}: FindOrdersByUserIdDTO) {
  if (!userId || userId.length < 1) {
    throw new BaseError({
      errorLocationCode: 'findOrdersByUserId:userId',
      message: 'Id de usuário inválido',
      statusCode: 400,
      requestId,
    });
  }

  let orders: order[];
  try {
    orders = await prisma.order.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    throw new BaseError({
      errorLocationCode: 'findOrdersByUserId:prisma',
      message: 'Erro ao buscar pedidos',
      statusCode: 500,
      requestId,
    });
  }

  return orders;
}
