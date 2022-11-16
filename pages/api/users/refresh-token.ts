import nextConnect from 'next-connect';
import * as requestHandler from '../../../use-cases/requestHandler';
import { NextApiResponse, NextApiRequest } from 'next';
import { tokenGenerate } from '../../../use-cases/users/tokenGenerate';

export default nextConnect({
  attachParams: true,
  onNoMatch: requestHandler.onNoMatchHandler,
  onError: requestHandler.onErrorHandler,
})
  .use(requestHandler.injectRequestMetadata)
  .use(requestHandler.logRequest)
  .post(postHandler);

async function postHandler(request: NextApiRequest, response: NextApiResponse) {
  const { refreshToken } = request.body;

  const result = await tokenGenerate({
    requestId: request.context.requestId,
    refreshToken,
  });

  return response.status(201).json(result);
}
