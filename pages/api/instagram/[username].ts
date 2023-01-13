import nextConnect from 'next-connect';
import * as requestHandler from '../../../use-cases/requestHandler';
import { NextApiResponse, NextApiRequest } from 'next';
import { sortPostsByUsername } from '../../../use-cases/instagram/sortPostsByUsername';

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
  const username = request.query.username as string;
  const { sortBy, only, fromDate, untilDate, postsLimit } = request.body;

  const user = await sortPostsByUsername({
    requestId: request.context.requestId,
    userId: request.context.userId,
    username,
    sortBy,
    only,
    fromDate: new Date(fromDate),
    untilDate: new Date(untilDate),
    postsLimit: Number(postsLimit),
  });

  response.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate'
  );

  return response.status(200).json(user);
}
