import nextConnect from 'next-connect';
import { formatISO } from 'date-fns';
import * as requestHandler from '../../use-cases/requestHandler';
import { NextApiResponse, NextApiRequest } from 'next';
import prisma from '../../lib/prisma';
import { BaseError } from '../../errors';

export default nextConnect({
  attachParams: true,
  onNoMatch: requestHandler.onNoMatchHandler,
  onError: requestHandler.onErrorHandler,
})
  .use(requestHandler.injectRequestMetadata)
  .use(requestHandler.logRequest)
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

  return response.status(200).json({
    updated_at: formatISO(Date.now()),
    dependencies: dependencies,
  });
}
