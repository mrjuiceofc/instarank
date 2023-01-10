import nextConnect from 'next-connect';
import * as requestHandler from '../../../use-cases/requestHandler';
import { NextApiResponse, NextApiRequest } from 'next';
import Stripe from 'stripe';
import { BaseError } from '../../../errors';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

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
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    response.status(400).send(
      new BaseError({
        errorLocationCode:
          'changePlanBySessionId:stripe.webhooks.constructEvent',
        message: 'Erro desconhecido ao buscar evento',
        statusCode: 400,
        requestId: request.context.requestId,
      })
    );
    return;
  }

  if (event.type !== 'customer.subscription.deleted') {
    response.status(400).send(
      new BaseError({
        errorLocationCode:
          'changePlanBySessionId:stripe.webhooks.constructEvent',
        message: 'O evento não é do tipo customer.subscription.deleted',
        statusCode: 400,
        requestId: request.context.requestId,
      })
    );
    return;
  }

  console.log('Evento recebido:', event);

  return response.status(200).json({
    message: 'Assinatura cancelada com sucesso',
  });
}
