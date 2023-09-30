import { order, user } from '@prisma/client';
import axios from 'axios';
import { BaseError } from '../../errors';
import prisma from '../../lib/prisma';
import { smmTranslateStatus } from '../../lib/utils/smmTranslateStatus';
import { sendEmail } from '../sendEmail';
import { SMMOrder, UpdateNotCompletedOrdersDTO } from './dto';
('');
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
    let user: user;
    try {
      user = await prisma.user.findUnique({
        where: {
          id: order.userId,
        },
      });
    } catch (error) {
      continue;
    }

    if (!user) {
      continue;
    }

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

    try {
      await prisma.order.update({
        where: {
          id: order.id,
        },
        data: {
          charge: Number(smmOrder.charge),
          currency: smmOrder.currency,
          remains: smmOrder.remains,
          status: newStatus,
        },
      });
    } catch (error) {
      continue;
    }

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

    if (['COMPLETED', 'PARTIAL'].includes(newStatus)) {
      try {
        await sendEmail({
          requestId,
          subject: `Sua ordem de ${order.amount} seguidores para o Instagram ${order.username} foi concluída`,
          to: user.email,
          template: 'CompletedOrder',
          variables: {
            username: order.username,
            actionUrl: `${process.env.FRONTEND_URL}/app?utm_source=system+emails&utm_medium=email&utm_campaign=notify-order`,
            amount: String(order.amount),
            remains: String(smmOrder.remains),
          },
        });
      } catch (error) {
        continue;
      }
    } else if (newStatus === 'CANCELLED') {
      try {
        await sendEmail({
          requestId,
          subject: `Sua ordem de ${order.amount} seguidores para o Instagram ${order.username} foi cancelada`,
          to: user.email,
          template: 'ErrorOrder',
          variables: {
            username: order.username,
            actionUrl: `${process.env.FRONTEND_URL}/app?utm_source=system+emails&utm_medium=email&utm_campaign=notify-order-error`,
            amount: String(order.amount),
          },
        });
      } catch (error) {
        continue;
      }
    }

    updatedOrderIds.push(order.id);
  }

  return updatedOrderIds;
}
