import nextConnect from 'next-connect';
import * as controller from '../../../use-cases/requestHandler';
import { NextApiResponse, NextApiRequest } from 'next';
import { userCreate } from '../../../use-cases/users/userCreate';

export default nextConnect({
  attachParams: true,
  onNoMatch: controller.onNoMatchHandler,
  onError: controller.onErrorHandler,
})
  .use(controller.injectRequestMetadata)
  .use(controller.logRequest)
  .post(postHandler);

async function postHandler(request: NextApiRequest, response: NextApiResponse) {
  const { email, password } = request.body;

  const result = await userCreate({
    requestId: request.context.requestId,
    ip: request.context.clientIp,
    email,
    password,
  });

  return response.status(201).json(result);
}