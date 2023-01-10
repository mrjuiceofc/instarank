import nextConnect from 'next-connect';
import * as requestHandler from '../../../use-cases/requestHandler';
import { NextApiResponse, NextApiRequest } from 'next';
import { BaseError } from '../../../errors';
import { buffer } from 'micro';
import { processWebhook } from '../../../use-cases/plans/processWebhook';

export default nextConnect({
  attachParams: true,
  onNoMatch: requestHandler.onNoMatchHandler,
  onError: requestHandler.onErrorHandler,
})
  .use(requestHandler.injectRequestMetadata)
  .use(requestHandler.logRequest)
  .use(requestHandler.handleLimit)
  .post(postHandler);

async function postHandler(request: NextApiRequest, response: NextApiResponse) {
  const event = await processWebhook({
    request,
    eventName: 'customer.subscription.deleted',
  });

  console.log('Evento recebido:', event);

  return response.status(200).json({
    message: 'Assinatura cancelada com sucesso',
  });
}

export const config = { api: { bodyParser: false } };
