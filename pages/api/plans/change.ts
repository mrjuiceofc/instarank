import nextConnect from 'next-connect';
import * as requestHandler from '../../../use-cases/requestHandler';
import { NextApiResponse, NextApiRequest } from 'next';
import { changePlanBySessionId } from '../../../use-cases/plans/changePlanBySessionId';

export default nextConnect({
  attachParams: true,
  onNoMatch: requestHandler.onNoMatchHandler,
  onError: requestHandler.onErrorHandler,
})
  .use(requestHandler.injectRequestMetadata)
  .use(requestHandler.logRequest)
  .use(requestHandler.authRequire)
  .use(requestHandler.handleLimit)
  .post(postHandler);

async function postHandler(request: NextApiRequest, response: NextApiResponse) {
  const { sessionId } = request.body;

  await changePlanBySessionId({
    sessionId,
    requestId: request.context.requestId,
  });

  return response.status(200).json({
    message: 'Plano alterado com sucesso',
  });
}
