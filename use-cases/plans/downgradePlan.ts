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

  if (!customer.email) {
    console.log(`[downgradePlan] customer ${stripeCustomerId} sem email`);
    throw new BaseError({
      statusCode: 400,
      errorLocationCode: 'downgradePlan:stripe.customers.retrieve',
      message: 'Customer sem email',
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
        email: customer.email,
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

  const resetLimitDate = new Date(user.limitResetAt);
  const lastInvoiceDate = new Date(lastInvoice.created * 1000);

  let forceResetNow = false;
  if (resetLimitDate > lastInvoiceDate) {
    forceResetNow = true;
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
      forceNow: forceResetNow,
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
      message:
        'Houve uma falha na cobrança da sua assinatura por isso o seu plano foi alterado para o plano free. Você continuará tendo acesso ao plano premium até completar 30 dias da última cobrança feita com sucesso.',
      title: 'Falha na cobrança',
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
