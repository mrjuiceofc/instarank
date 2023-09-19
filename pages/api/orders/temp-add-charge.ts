import nextConnect from 'next-connect';
import * as requestHandler from '../../../use-cases/requestHandler';
import { NextApiResponse, NextApiRequest } from 'next';
import prisma from '../../../lib/prisma';
import { SMMOrder } from '../../../use-cases/orders/dto';
import axios from 'axios';

export default nextConnect({
  attachParams: true,
  onNoMatch: requestHandler.onNoMatchHandler,
  onError: requestHandler.onErrorHandler,
})
  .use(requestHandler.injectRequestMetadata)
  .use(requestHandler.logRequest)
  .get(getHandler);

async function getHandler(request: NextApiRequest, response: NextApiResponse) {
  const allOrders = await prisma.order.findMany({
    where: {
      OR: [
        {
          currency: null,
        },
        {
          charge: null,
        },
      ],
    },
  });

  const updatedOrderIds = [];
  for (const order of allOrders) {
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

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        currency: smmOrder.currency,
        charge: Number(smmOrder.charge),
      },
    });

    updatedOrderIds.push(order.id);
  }

  return response.status(200).json(updatedOrderIds);
}
