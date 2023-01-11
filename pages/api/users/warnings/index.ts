import nextConnect from 'next-connect';
import * as requestHandler from '../../../../use-cases/requestHandler';
import { NextApiResponse, NextApiRequest } from 'next';
import { getWarningsFromUserId } from '../../../../use-cases/users/warnings/getWarningsFromUserId';

export default nextConnect({
  attachParams: true,
  onNoMatch: requestHandler.onNoMatchHandler,
  onError: requestHandler.onErrorHandler,
})
  .use(requestHandler.injectRequestMetadata)
  .use(requestHandler.logRequest)
  .use(requestHandler.authRequire)
  .use(requestHandler.handleLimit)
  .get(getHandler);

async function getHandler(request: NextApiRequest, response: NextApiResponse) {
  const userId = request.context.userId;
  const requestId = request.context.requestId;

  const result = await getWarningsFromUserId({ userId, requestId });

  response.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate'
  );

  return response.status(200).json(result);
}
