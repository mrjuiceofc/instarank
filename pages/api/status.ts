import nextConnect from 'next-connect';
import { formatISO } from 'date-fns';
import * as controller from '../../services/requestHandler';
import { NextApiResponse, NextApiRequest } from 'next';
import prisma from '../../lib/prisma';
import { BaseError } from '../../errors';

export default nextConnect({
  attachParams: true,
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
})
  .use(controller.injectRequestMetadata)
  .use(controller.logRequest)
  .get(getHandler);

async function getHandler(request: NextApiRequest, response: NextApiResponse) {
  const dependencies = {
    API: 'UP',
    DATABASE: 'UP',
  };

  try {
    await prisma.$disconnect();
    await prisma.$connect();
  } catch (error) {
    dependencies.DATABASE = 'DOWN';
    throw new BaseError({
      message: error.message,
      requestId: request.context.requestId,
      errorLocationCode: 'status.ts:getHandler:prisma.$connect',
    });
  }

  response.setHeader(
    'Cache-Control',
    'public, s-maxage=1, stale-while-revalidate'
  );

  return response.status(200).json({
    updated_at: formatISO(Date.now()),
    dependencies: dependencies,
  });
}
