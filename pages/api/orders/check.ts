import nextConnect from 'next-connect';
import * as requestHandler from '../../../use-cases/requestHandler';
import { NextApiResponse, NextApiRequest } from 'next';
import { updateNotCompletedOrders } from '../../../use-cases/orders/updateNotCompletedOrders';

export default nextConnect({
  attachParams: true,
  onNoMatch: requestHandler.onNoMatchHandler,
  onError: requestHandler.onErrorHandler,
})
  .use(requestHandler.injectRequestMetadata)
  .use(requestHandler.logRequest)
  .post(postHandler);

async function postHandler(request: NextApiRequest, response: NextApiResponse) {
  const updatedOrderIds = await updateNotCompletedOrders({
    requestId: request.context.requestId,
  });

  return response.status(200).json(updatedOrderIds);
}
