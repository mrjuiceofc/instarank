import { plan, user } from '@prisma/client';
import { BaseError } from '../../errors';
import prisma from '../../lib/prisma';
import { CreateCheckoutSessionDTO } from './dto';
import Stripe from 'stripe';

export async function createCheckoutSession({
  planName,
  userId,
  requestId,
}: CreateCheckoutSessionDTO) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
  });

  let user: user;
  try {
    user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  } catch (error) {
    throw new BaseError({
      message: 'Erro desconhecido ao buscar usuário',
      requestId,
      statusCode: 500,
      errorLocationCode: 'createCheckoutSession:prisma.user.findUnique',
    });
  }

  if (!user) {
    throw new BaseError({
      message: 'Usuário não encontrado',
      requestId,
      statusCode: 404,
      errorLocationCode: 'createCheckoutSession:prisma.user.findUnique',
    });
  }

  let plan: plan;
  try {
    plan = await prisma.plan.findUnique({
      where: {
        name: planName,
      },
    });
  } catch (error) {
    throw new BaseError({
      message: 'Erro desconhecido ao buscar plano',
      requestId,
      statusCode: 500,
      errorLocationCode: 'createCheckoutSession:prisma.plan.findUnique',
    });
  }

  if (!plan) {
    throw new BaseError({
      message: 'Plano não encontrado',
      requestId,
      statusCode: 404,
      errorLocationCode: 'createCheckoutSession:prisma.plan.findUnique',
    });
  }

  if (plan.price === 0) {
    throw new BaseError({
      message: 'Plano gratuito não pode ser comprado',
      requestId,
      statusCode: 400,
      errorLocationCode: 'createCheckoutSession:prisma.plan.findUnique',
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

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create({
      success_url: `${process.env.FRONTEND_URL}/checkout/success?plan=${plan.name}`,
      line_items: [
        {
          price: plan.gatewayId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: !user.gatewayId ? user.email : undefined,
      customer: user.gatewayId ? user.gatewayId : undefined,
      locale: 'pt-BR',
      payment_method_types: ['card', 'boleto'],
    });
  } catch (error) {
    throw new BaseError({
      message: 'Erro ao criar a sessão do checkout',
      requestId,
      statusCode: 500,
      errorLocationCode:
        'createCheckoutSession:stripe.checkout.sessions.create',
    });
  }

  return {
    id: session.id,
    url: session.url,
  };
}
