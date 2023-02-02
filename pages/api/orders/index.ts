import nextConnect from 'next-connect';
import * as requestHandler from '../../../use-cases/requestHandler';
import { NextApiResponse, NextApiRequest } from 'next';
import { orderFollowers } from '../../../use-cases/orders/orderFollowers';
import { findOrdersByUserId } from '../../../use-cases/orders/findOrdersByUserId';

export default nextConnect({
  attachParams: true,
  onNoMatch: requestHandler.onNoMatchHandler,
  onError: requestHandler.onErrorHandler,
})
  .use(requestHandler.injectRequestMetadata)
  .use(requestHandler.logRequest)
  .use(requestHandler.authRequire)
  .use(requestHandler.handleLimit)
  .post(postHandler)
  .get(getHandler);

async function postHandler(request: NextApiRequest, response: NextApiResponse) {
  const { username, amount } = request.body;

  const order = await orderFollowers({
    requestId: request.context.requestId,
    userId: request.context.userId,
    username,
    amount: Number(amount),
  });

  return response.status(200).json(order);
}

async function getHandler(request: NextApiRequest, response: NextApiResponse) {
  const orders = await findOrdersByUserId({
    requestId: request.context.requestId,
    userId: request.context.userId,
  });

  return response.status(200).json(orders);
}
