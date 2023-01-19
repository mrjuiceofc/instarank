import nextConnect from 'next-connect';
import * as requestHandler from '../../../use-cases/requestHandler';
import { NextApiResponse, NextApiRequest } from 'next';
import { userCreate } from '../../../use-cases/users/userCreate';

export default nextConnect({
  attachParams: true,
  onNoMatch: requestHandler.onNoMatchHandler,
  onError: requestHandler.onErrorHandler,
})
  .use(requestHandler.injectRequestMetadata)
  .use(requestHandler.logRequest)
  .post(postHandler);

async function postHandler(request: NextApiRequest, response: NextApiResponse) {
  const { email, password, utmSource, utmMedium, utmCampaign } = request.body;

  const result = await userCreate({
    requestId: request.context.requestId,
    ip: request.context.clientIp,
    email,
    password,
    utmSource,
    utmMedium,
    utmCampaign,
  });

  return response.status(201).json(result);
}
