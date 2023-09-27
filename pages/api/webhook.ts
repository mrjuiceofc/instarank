import nextConnect from 'next-connect';
import * as requestHandler from '../../use-cases/requestHandler';
import { NextApiResponse, NextApiRequest } from 'next';
import { BaseError } from '../../errors';
import { processWebhook } from '../../use-cases/plans/processWebhook';
import { downgradePlan } from '../../use-cases/plans/downgradePlan';
import { changePlanByWebhookObject } from '../../use-cases/plans/changePlanByWebhookObject';

type ActionFunction = (data: {
  requestId: string;
  object: any;
}) => Promise<any>;

type ActionsEventType = Record<string, ActionFunction>;

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
  });

  if (!event) {
    throw new BaseError({
      statusCode: 400,
      errorLocationCode: 'webhook',
      message: 'Evento não encontrado',
      requestId: request.context.requestId,
    });
  }

  const actionsEventType: ActionsEventType = {
    'customer.subscription.deleted': downgradePlan,
    'checkout.session.completed': changePlanByWebhookObject,
    'checkout.session.async_payment_succeeded': changePlanByWebhookObject,
  };

  const action = actionsEventType[event.type];

  if (!action) {
    console.log(
      `[Webhook] ignorando chamado pois não existe ações para o evento ${event.type}`
    );
    return response.status(200).json({
      message: 'Não existe ação para o evento',
    });
  }

  console.log(`[Webhook] executando ação para o evento ${event.type}`);

  const result = await action({
    requestId: request.context.requestId,
    object: event.data.object,
  });

  return response.status(200).json(result);
}

export const config = { api: { bodyParser: false } };
