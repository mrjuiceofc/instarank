import Stripe from 'stripe';
import { BaseError } from '../../errors';
import { ProcessWebhookDTO } from './dto';
import { buffer } from 'micro';

export async function processWebhook({ request }: ProcessWebhookDTO) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
  });

  console.log(`[processWebhook] processando novo webhook...`);

  const sig = request.headers['stripe-signature'];

  if (!sig || !sig.length) {
    console.log('[processWebhook] Signature não encontrada');
    throw new BaseError({
      errorLocationCode: 'changePlanBySessionId:stripe.webhooks.constructEvent',
      message: 'Signature não encontrada',
      statusCode: 400,
      requestId: request.context.requestId,
    });
  }

  let event: Stripe.Event;
  const reqBuffer = await buffer(request);

  console.log('[processWebhook] Verificando webhook...');
  try {
    event = stripe.webhooks.constructEvent(
      reqBuffer,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log('[processWebhook] Erro ao verificar webhook:', error);
    throw new BaseError({
      errorLocationCode: 'changePlanBySessionId:stripe.webhooks.constructEvent',
      message: 'Erro desconhecido ao buscar evento',
      statusCode: 400,
      requestId: request.context.requestId,
    });
  }

  return event;
}
