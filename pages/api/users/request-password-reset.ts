import nextConnect from 'next-connect';
import * as requestHandler from '../../../use-cases/requestHandler';
import { NextApiResponse, NextApiRequest } from 'next';
import { requestPasswordReset } from '../../../use-cases/users/requestPasswordReset';

export default nextConnect({
  attachParams: true,
  onNoMatch: requestHandler.onNoMatchHandler,
  onError: requestHandler.onErrorHandler,
})
  .use(requestHandler.injectRequestMetadata)
  .use(requestHandler.logRequest)
  .post(postHandler);

async function postHandler(request: NextApiRequest, response: NextApiResponse) {
  const { email, newPassword } = request.body;

  const result = await requestPasswordReset({
    requestId: request.context.requestId,
    ip: request.context.clientIp,
    email,
    newPassword,
  });

  return response.status(200).json(result);
}
