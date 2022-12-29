import nextConnect from 'next-connect';
import * as requestHandler from '../../../../use-cases/requestHandler';
import { NextApiResponse, NextApiRequest } from 'next';
import { markWarningAsRead } from '../../../../use-cases/users/warnings/markWarningAsRead';

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
  const warningId = request.query.id as string;
  const requestId = request.context.requestId;

  const result = await markWarningAsRead({
    userId,
    requestId,
    warningId,
  });

  return response.status(200).json(result);
}
