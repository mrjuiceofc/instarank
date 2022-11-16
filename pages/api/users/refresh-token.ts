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
  const { authorization } = request.headers;

  if (!authorization) {
    return response.status(401).json({
      message: 'No authorization header found',
    });
  }

  let refreshToken = authorization?.split(' ')[1];

  if (!refreshToken) {
    return response.status(400).json({
      message: 'Refresh token is required',
    });
  }

  if (typeof refreshToken !== 'string') {
    return response.status(400).json({
      message: 'Refresh token must be a string',
    });
  }

  const result = await tokenGenerate({
    requestId: request.context.requestId,
    refreshToken,
  });

  return response.status(201).json(result);
}
