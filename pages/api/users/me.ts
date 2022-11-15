import nextConnect from 'next-connect';
import * as requestHandler from '../../../use-cases/requestHandler';
import { NextApiResponse, NextApiRequest } from 'next';
import { getUserFromId } from '../../../use-cases/users/getUserFromId';

export default nextConnect({
  attachParams: true,
  onNoMatch: requestHandler.onNoMatchHandler,
  onError: requestHandler.onErrorHandler,
})
  .use(requestHandler.injectRequestMetadata)
  .use(requestHandler.logRequest)
  .use(requestHandler.authRequire)
  .get(getHandler);

async function getHandler(request: NextApiRequest, response: NextApiResponse) {
  const userId = request.context.userId;
  const requestId = request.context.requestId;

  const user = await getUserFromId({
    requestId,
    userId,
  });

  response.status(200).json(user);
}
