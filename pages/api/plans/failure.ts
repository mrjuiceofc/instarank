import nextConnect from 'next-connect';
import * as requestHandler from '../../../use-cases/requestHandler';
import { NextApiResponse, NextApiRequest } from 'next';
import { BaseError } from '../../../errors';
import { buffer } from 'micro';
import { processWebhook } from '../../../use-cases/plans/processWebhook';
import { downgradePlan } from '../../../use-cases/plans/downgradePlan';

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

  if (!event) {
    throw new BaseError({
      statusCode: 400,
      errorLocationCode: 'failure:stripe.customer.subscription.deleted',
      message: 'Evento não encontrado',
      requestId: request.context.requestId,
    });
  }

  if (!(event.data.object as any).customer) {
    throw new BaseError({
      statusCode: 400,
      errorLocationCode: 'failure:stripe.customer.subscription.deleted',
      message: 'Customer não encontrado',
      requestId: request.context.requestId,
    });
  }

  await downgradePlan({
    requestId: request.context.requestId,
    stripeCustomerId: (event.data.object as any).customer,
  });

  return response.status(200).json({
    message: 'Assinatura cancelada com sucesso',
  });
}

export const config = { api: { bodyParser: false } };
