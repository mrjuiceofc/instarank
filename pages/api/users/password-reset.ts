import nextConnect from 'next-connect';
import * as requestHandler from '../../../use-cases/requestHandler';
import { NextApiResponse, NextApiRequest } from 'next';
import { passwordReset } from '../../../use-cases/users/passwordReset';

export default nextConnect({
  attachParams: true,
  onNoMatch: requestHandler.onNoMatchHandler,
  onError: requestHandler.onErrorHandler,
})
  .use(requestHandler.injectRequestMetadata)
  .use(requestHandler.logRequest)
  .post(postHandler);

async function postHandler(request: NextApiRequest, response: NextApiResponse) {
  const { token } = request.body;

  const result = await passwordReset({
    requestId: request.context.requestId,
    ip: request.context.clientIp,
    token,
  });

  return response.status(200).json(result);
}
