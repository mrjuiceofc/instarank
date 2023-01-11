import { DowngradePlanDTO } from './dto';
import Stripe from 'stripe';
import { BaseError } from '../../errors';
import { plan, user } from '@prisma/client';
import prisma from '../../lib/prisma';
import { handleLimitReset } from '../users/handleLimitReset';
import { createWarning } from '../users/warnings/createWarning';
import { createCheckoutSession } from './createCheckoutSession';

export async function downgradePlan({
  requestId,
  stripeCustomerId,
}: DowngradePlanDTO) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
  });

  let customer: Stripe.Customer;
  try {
    console.log(`[downgradePlan] buscando customer ${stripeCustomerId}`);
    const findCustomer = await stripe.customers.retrieve(stripeCustomerId);

    customer = findCustomer as Stripe.Customer;
  } catch (error) {
    console.log(`[downgradePlan] error: ${error}`);
    throw new BaseError({
      statusCode: 500,
      errorLocationCode: 'downgradePlan:stripe.customers.retrieve',
      message: 'Erro ao buscar customer',
      requestId,
    });
  }

  if (!customer) {
    console.log(`[downgradePlan] customer ${stripeCustomerId} não encontrado`);
    throw new BaseError({
      statusCode: 404,
      errorLocationCode: 'downgradePlan:stripe.customers.retrieve',
      message: 'Customer não encontrado',
      requestId,
    });
  }

  if ((customer as any).deleted) {
    console.log(`[downgradePlan] customer ${stripeCustomerId} deletado`);
    throw new BaseError({
      statusCode: 404,
      errorLocationCode: 'downgradePlan:stripe.customers.retrieve',
      message: 'Customer deletado',
      requestId,
    });
  }

  if (!customer.email && !customer.id) {
    console.log(`[downgradePlan] customer ${stripeCustomerId} sem email`);
    throw new BaseError({
      statusCode: 400,
      errorLocationCode: 'downgradePlan:stripe.customers.retrieve',
      message: 'Customer não tem email e nem id',
      requestId,
    });
  }

  let user: user & {
    plan: plan;
  };
  try {
    console.log(`[downgradePlan] buscando usuário`);
    user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            gatewayId: customer.id || undefined,
          },
          {
            email: customer.email || undefined,
          },
        ],
        deletedAt: null,
      },
      include: {
        plan: true,
      },
    });
  } catch (error) {
    console.log(`[downgradePlan] error ao buscar usuário: ${error}`);
    throw new BaseError({
      statusCode: 500,
      message: 'Erro ao buscar usuário',
      requestId,
      errorLocationCode: 'downgradePlan:prisma.user.findFirst',
    });
  }

  if (!user) {
    console.log(`[downgradePlan] usuário não encontrado`);
    throw new BaseError({
      statusCode: 404,
      message: 'Usuário não encontrado',
      requestId,
      errorLocationCode: 'downgradePlan:prisma.user.findFirst',
    });
  }

  let freePlan: plan;
  try {
    console.log(`[downgradePlan] buscando plano free`);
    freePlan = await prisma.plan.findFirst({
      where: {
        name: 'free',
      },
    });
  } catch (error) {
    console.log(`[downgradePlan] error ao buscar plano free: ${error}`);
    throw new BaseError({
      statusCode: 500,
      message: 'Erro ao buscar plano free',
      requestId,
      errorLocationCode: 'downgradePlan:prisma.plan.findFirst',
    });
  }

  if (!freePlan) {
    console.log(`[downgradePlan] plano free não encontrado`);
    throw new BaseError({
      statusCode: 404,
      message: 'Plano free não encontrado',
      requestId,
      errorLocationCode: 'downgradePlan:prisma.plan.findFirst',
    });
  }

  if (user.planId === freePlan.id) {
    console.log(`[downgradePlan] usuário já está no plano free`);
    throw new BaseError({
      statusCode: 400,
      message: 'Usuário já está no plano free',
      requestId,
      errorLocationCode: 'downgradePlan:prisma.plan.findFirst',
    });
  }

  let lastInvoice: Stripe.Invoice;
  try {
    console.log(`[downgradePlan] buscando última invoice`);
    const findLastInvoice = await stripe.invoices.list({
      customer: stripeCustomerId,
      limit: 1,
    });

    lastInvoice = findLastInvoice.data[0];
  } catch (error) {
    console.log(`[downgradePlan] error ao buscar última invoice: ${error}`);
    throw new BaseError({
      statusCode: 500,
      message: 'Erro ao buscar última invoice',
      requestId,
      errorLocationCode: 'downgradePlan:stripe.invoices.list',
    });
  }

  if (!lastInvoice) {
    console.log(`[downgradePlan] última invoice não encontrada`);
    throw new BaseError({
      statusCode: 404,
      message: 'Última invoice não encontrada',
      requestId,
      errorLocationCode: 'downgradePlan:stripe.invoices.list',
    });
  }

  let errorInLastInvoice = false;
  if (lastInvoice.status === 'uncollectible') {
    errorInLastInvoice = true;
  }

  try {
    console.log(`[downgradePlan] atualizando usuário`);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        plan: {
          connect: {
            id: freePlan.id,
          },
        },
      },
    });
  } catch (error) {
    console.log(`[downgradePlan] error ao atualizar usuário: ${error}`);
    throw new BaseError({
      statusCode: 500,
      message: 'Erro ao atualizar usuário',
      requestId,
      errorLocationCode: 'downgradePlan:prisma.user.update',
    });
  }

  try {
    console.log(`[downgradePlan] redefinindo limites`);
    await handleLimitReset({
      requestId,
      userId: user.id,
      forceNow: errorInLastInvoice,
    });
  } catch (error) {
    console.log(`[downgradePlan] error ao redefinir limites: ${error}`);
    throw new BaseError({
      statusCode: 500,
      message: 'Erro ao redefinir limites',
      requestId,
      errorLocationCode: 'downgradePlan:handleLimitReset',
    });
  }

  let checkoutSessionUrl: string;
  try {
    console.log(`[downgradePlan] criando checkout session`);
    const checkoutSession = await createCheckoutSession({
      requestId,
      userId: user.id,
      planName: user.plan.name,
    });
    checkoutSessionUrl = checkoutSession.url;
  } catch (error) {
    console.log(
      `[downgradePlan] error ao criar checkout session: ${error} | não afeta o downgrade`
    );
    return;
  }

  try {
    console.log(`[downgradePlan] criando warning`);
    await createWarning({
      requestId,
      userId: user.id,
      message: errorInLastInvoice
        ? 'Houve uma falha na cobrança da sua assinatura por isso o seu plano foi alterado para o plano free. Como a sua ultima cobrança não foi paga, o seu limite de ordenações foi definido para o limite do plano free.'
        : 'Sua assinatura foi cancelada e agora você está usando o plano free, caso não reconheça essa ação entre em contato com contato@instarank.com.br para saber mais. Você continuará tendo acesso ao plano premium até completar 30 dias da última cobrança paga.',
      title: errorInLastInvoice ? 'Falha na cobrança' : 'Assinatura cancelada',
      actionText: 'Assinar novamente',
      actionUrl: checkoutSessionUrl,
    });
  } catch (error) {
    console.log(
      `[downgradePlan] error ao criar warning: ${error} | não afeta o downgrade`
    );
    return;
  }
}
