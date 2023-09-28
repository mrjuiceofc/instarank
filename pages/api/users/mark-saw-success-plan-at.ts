import nextConnect from 'next-connect';
import * as requestHandler from '../../../use-cases/requestHandler';
import { NextApiResponse, NextApiRequest } from 'next';
import { markSawSuccessPlanAt } from '../../../use-cases/users/markSawSuccessPlanAt';

export default nextConnect({
  attachParams: true,
  onNoMatch: requestHandler.onNoMatchHandler,
  onError: requestHandler.onErrorHandler,
})
  .use(requestHandler.injectRequestMetadata)
  .use(requestHandler.logRequest)
  .use(requestHandler.authRequire)
  .use(requestHandler.handleLimit)
  .put(putHandler);

async function putHandler(request: NextApiRequest, response: NextApiResponse) {
  const userId = request.context.userId;
  const requestId = request.context.requestId;

  const result = await markSawSuccessPlanAt({
    requestId,
    userId,
  });

  response.status(200).json(result);
}
