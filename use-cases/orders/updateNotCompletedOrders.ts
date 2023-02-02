import { order } from '@prisma/client';
import axios from 'axios';
import { BaseError } from '../../errors';
import prisma from '../../lib/prisma';
import { smmTranslateStatus } from '../../lib/utils/smmTranslateStatus';
import { SMMOrder, UpdateNotCompletedOrdersDTO } from './dto';

export async function updateNotCompletedOrders({
  requestId,
}: UpdateNotCompletedOrdersDTO) {
  let updatedOrderIds: string[] = [];

  let orders: order[];
  try {
    orders = await prisma.order.findMany({
      where: {
        status: {
          in: ['PENDING', 'IN_PROGRESS', 'PROCESSING'],
        },
      },
      take: 10,
    });
  } catch (error) {
    throw new BaseError({
      errorLocationCode: 'updateNotCompletedOrders:prisma',
      message: 'Erro ao buscar pedidos',
      statusCode: 500,
      requestId,
    });
  }

  if (orders.length < 1) {
    return;
  }

  for (const order of orders) {
    let smmOrder: SMMOrder;
    try {
      const response = await axios.get('https://smmengineer.com/api/v2', {
        params: {
          key: process.env.SMMENGINEER_API_KEY,
          action: 'status',
          order: order.smmOrderId,
        },
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      const rawOrder = response.data;

      smmOrder = {
        charge: rawOrder.charge,
        start_count: Number(rawOrder.start_count),
        status: rawOrder.status,
        remains: Number(rawOrder.remains),
        currency: rawOrder.currency,
      };
    } catch (error) {
      continue;
    }

    const newStatus = smmTranslateStatus[smmOrder.status];

    if (
      ['COMPLETED', 'PARTIAL', 'CANCELLED'].includes(newStatus) &&
      smmOrder.remains
    ) {
      try {
        await prisma.user.update({
          where: {
            id: order.userId,
          },
          data: {
            monthlyLimit: {
              increment: smmOrder.remains,
            },
          },
        });
      } catch (error) {
        continue;
      }
    }

    try {
      await prisma.order.update({
        where: {
          id: order.id,
        },
        data: {
          remains: smmOrder.remains,
          status: newStatus,
        },
      });
    } catch (error) {
      continue;
    }

    updatedOrderIds.push(order.id);
  }

  return updatedOrderIds;
}
