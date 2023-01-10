import nextConnect from 'next-connect';
import * as requestHandler from '../../../use-cases/requestHandler';
import { NextApiResponse, NextApiRequest } from 'next';
import { getDataByUsername } from '../../../use-cases/instagram/getDataByUsername';

export default nextConnect({
  attachParams: true,
  onNoMatch: requestHandler.onNoMatchHandler,
  onError: requestHandler.onErrorHandler,
})
  .use(requestHandler.injectRequestMetadata)
  .use(requestHandler.logRequest)
  .use(requestHandler.authRequire)
  .use(requestHandler.handleLimit)
  .get(getHandler);

async function getHandler(request: NextApiRequest, response: NextApiResponse) {
  const username = request.query.username as string;

  const user = await getDataByUsername({
    requestId: request.context.requestId,
    username,
  });

  response.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate'
  );

  return response.status(200).json(user);
}
