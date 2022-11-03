import { v4 as uuidV4 } from 'uuid';
import logger from '../infra/logger';
import { BaseError } from '../errors/index';
import { NextApiRequest, NextApiResponse } from 'next';

export function extractAnonymousIpFromRequest(request: NextApiRequest): string {
  let ip = request.headers['x-real-ip'] || request.socket.remoteAddress;

  if (typeof ip !== 'string') {
    ip = ip.toString();
  }

  if (ip === '::1') {
    ip = '127.0.0.1';
  }

  if (ip.substr(0, 7) == '::ffff:') {
    ip = ip.substr(7);
  }

  const ipParts = ip.split('.');
  ipParts[3] = '0';
  const anonymizedIp = ipParts.join('.');

  return anonymizedIp;
}

export async function injectRequestMetadata(
  request: NextApiRequest,
  response: NextApiResponse,
  next: () => void
) {
  request.context = {
    ...request.context,
    requestId: uuidV4(),
    clientIp: extractAnonymousIpFromRequest(request),
  };

  next();
}

export async function onNoMatchHandler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const errorObject = new BaseError({
    requestId: request.context?.requestId || uuidV4(),
    message: 'Not Found',
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
