import nextConnect from 'next-connect';
import * as requestHandler from '../../use-cases/requestHandler';
import { NextApiResponse, NextApiRequest } from 'next';
import * as JSXMail from 'jsx-mail';

export default nextConnect({
  attachParams: true,
  onNoMatch: requestHandler.onNoMatchHandler,
  onError: requestHandler.onErrorHandler,
})
  .use(requestHandler.injectRequestMetadata)
  .use(requestHandler.logRequest)
  .get(getHandler);

async function getHandler(request: NextApiRequest, response: NextApiResponse) {
  response.setHeader(
    'Cache-Control',
    'public, s-maxage=1, stale-while-revalidate'
  );

  try {
    const templateHTML = await JSXMail.render('Welcome', {
      name: 'John',
    });

    return response.status(200).send(templateHTML);
  } catch (error) {
    return response.status(500).send(error.message);
  }
}
