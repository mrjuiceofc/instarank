import { v4 as uuidV4 } from 'uuid';
import logger from '../infra/logger';
import { BaseError } from '../errors/index';
import { NextApiRequest, NextApiResponse } from 'next';
import * as jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import requestIp from 'request-ip';
import { handleLimitReset } from './users/handleLimitReset';

export function extractIpFromRequest(request: NextApiRequest): string {
  let ip = requestIp.getClientIp(request);

  if (typeof ip !== 'string') {
    ip = ip.toString();
  }

  if (ip === '::1') {
    ip = '127.0.0.1';
  }

  if (ip.substr(0, 7) == '::ffff:') {
    ip = ip.substr(7);
  }

  return ip;
}

export async function authRequire(
  request: NextApiRequest,
  response: NextApiResponse,
  next: () => void
) {
  const authHeader = request.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return response.status(401).json(
      new BaseError({
        message: 'Token não encontrado',
        requestId: request.context.requestId,
        errorLocationCode: 'authRequire',
        statusCode: 401,
      })
    );
  }

  let decodedToken: jwt.JwtPayload;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;
  } catch (error) {
    return response.status(401).json(
      new BaseError({
        message: 'Token inválido',
        requestId: request.context.requestId,
        errorLocationCode: 'authRequire:jwt.verify',
        statusCode: 401,
      })
    );
  }

  if (!decodedToken) {
    return response.status(401).json(
      new BaseError({
        message: 'Token inválido',
        requestId: request.context.requestId,
        errorLocationCode: 'authRequire:jwt.verify',
        statusCode: 401,
      })
    );
  }

  request.context.userId = decodedToken.id;

  await prisma.user.update({
    where: {
      id: decodedToken.id,
    },
    data: {
      lastAccessAt: new Date(),
    },
  });

  next();
}

export async function injectRequestMetadata(
  request: NextApiRequest,
  response: NextApiResponse,
  next: () => void
) {
  request.context = {
    ...request.context,
    requestId: uuidV4(),
    clientIp: extractIpFromRequest(request),
  };

  next();
}

export async function onNoMatchHandler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const errorObject = new BaseError({
    requestId: request.context?.requestId || uuidV4(),
    message: 'Rota não encontrada',
    statusCode: 404,
    errorLocationCode: 'onNoMatchHandler',
    errorId: uuidV4(),
  });
  logger.info(errorObject);
  return response.status(errorObject.statusCode).json(errorObject);
}

export function logRequest(
  request: NextApiRequest,
  response: NextApiResponse,
  next: () => void
) {
  const { method, url, headers, query, body, context } = request;

  const log = {
    method,
    url,
    headers,
    query,
    context,
    body,
  };

  logger.info(log);

  next();
}

export function onErrorHandler(
  error: BaseError,
  request: NextApiRequest,
  response: NextApiResponse
) {
  const errorObject = { ...error, requestId: request.context.requestId };
  logger.info(errorObject);
  return response.status(error.statusCode).json(errorObject);
}

export async function handleLimit(
  request: NextApiRequest,
  response: NextApiResponse,
  next: () => void
) {
  const requestId = request.context.requestId;
  const userId = request.context.userId;

  if (!userId) {
    return next();
  }

  await handleLimitReset({
    requestId,
    userId,
  });

  next();
}
