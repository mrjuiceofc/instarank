import { ChangePlanBySessionIdDTO } from './dto';
import Stripe from 'stripe';
import { BaseError } from '../../errors';
import { plan, user } from '@prisma/client';
import prisma from '../../lib/prisma';
import { handleLimitReset } from '../users/handleLimitReset';

type subscription = Stripe.Subscription & {
  plan: Stripe.Plan;
};

export async function changePlanBySessionId({
  sessionId,
  requestId,
}: ChangePlanBySessionIdDTO) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
  });

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    throw new BaseError({
      errorLocationCode:
        'changePlanBySessionId:stripe.checkout.sessions.retrieve',
      message: 'Erro desconhecido ao buscar sessão',
      statusCode: 500,
      requestId,
    });
  }

  if (
    !session &&
    session.object !== 'checkout.session' &&
    session.mode !== 'subscription'
  ) {
    throw new BaseError({
      errorLocationCode:
        'changePlanBySessionId:stripe.checkout.sessions.retrieve',
      message: 'Seção não encontrada',
      statusCode: 404,
      requestId,
    });
  }

  if (session.status !== 'complete') {
    throw new BaseError({
      errorLocationCode:
        'changePlanBySessionId:stripe.checkout.sessions.retrieve',
      message: 'O checkout não está completo',
      statusCode: 500,
      requestId,
    });
  }

  if (!session.customer) {
    throw new BaseError({
      errorLocationCode:
        'changePlanBySessionId:stripe.checkout.sessions.retrieve',
      message: 'O id do cliente não foi encontrado',
      statusCode: 500,
      requestId,
    });
  }

  let user: user;
  try {
    user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: session.customer_email || undefined,
          },
          {
            gatewayId: (session.customer as string) || undefined,
          },
        ],
      },
    });
  } catch (error) {
    console.log(error);
    throw new BaseError({
      errorLocationCode: 'changePlanBySessionId:prisma.user.findUnique',
      message: 'Erro desconhecido ao buscar usuário',
      statusCode: 500,
      requestId,
    });
  }

  if (!user) {
    throw new BaseError({
      errorLocationCode: 'changePlanBySessionId:prisma.user.findUnique',
      message: 'Usuário não encontrado',
      statusCode: 404,
      requestId,
    });
  }

  let subscription: subscription;
  try {
    const gatewaySubscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    subscription = gatewaySubscription as any;
  } catch (error) {
    throw new BaseError({
      errorLocationCode: 'changePlanBySessionId:stripe.subscriptions.retrieve',
      message: 'Erro desconhecido ao buscar assinatura',
      statusCode: 500,
      requestId,
    });
  }

  let plan: plan;
  try {
    plan = await prisma.plan.findFirst({
      where: {
        gatewayId: subscription.plan.id,
        deletedAt: null,
      },
    });
  } catch (error) {
    throw new BaseError({
      errorLocationCode: 'changePlanBySessionId:prisma.plan.findUnique',
      message: 'Erro desconhecido ao buscar plano',
      statusCode: 500,
      requestId,
    });
  }

  if (!plan) {
    throw new BaseError({
      errorLocationCode: 'changePlanBySessionId:prisma.plan.findUnique',
      message: 'Plano não encontrado',
      statusCode: 404,
      requestId,
    });
  }

  if (plan.id === user.planId) {
    throw new BaseError({
      message: 'Usuário já está no plano',
      requestId,
      statusCode: 400,
      errorLocationCode: 'createCheckoutSession:prisma.plan.findUnique',
    });
  }

  try {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        plan: {
          connect: {
            id: plan.id,
          },
        },
        gatewayId: session.customer as string,
      },
    });
  } catch (error) {
    throw new BaseError({
      errorLocationCode: 'changePlanBySessionId:prisma.user.update',
      message: 'Erro desconhecido ao atualizar usuário',
      statusCode: 500,
      requestId,
    });
  }

  try {
    await handleLimitReset({
      userId: user.id,
      requestId,
      forceNow: true,
    });
  } catch (error) {
    throw new BaseError({
      errorLocationCode: 'changePlanBySessionId:handleLimitReset',
      message: 'Erro desconhecido ao resetar limite',
      statusCode: 500,
      requestId,
    });
  }

  return;
}
