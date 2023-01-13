import { BaseError } from '../../errors';
import { GetProxyUrlDTO } from './dto';

export function getProxyUrl({ url }: GetProxyUrlDTO) {
  if (!process.env.SCRAPE_API_KEY) {
    console.log('Chave de API do ScrapingBee não encontrada');

    throw new BaseError({
      message: 'Chave de API do ScrapingBee não encontrada',
      statusCode: 500,
      errorLocationCode: 'instagram.getDataByUsername',
    });
  }

  const proxyUrl = ['preview', 'production'].includes(process.env.VERCEL_ENV)
    ? `http://api.scrape.do?token=${
        process.env.SCRAPE_API_KEY
      }&url=${encodeURIComponent(url)}&customHeaders=true`
    : url;

  console.log(`[getProxyUrl] proxyUrl: ${proxyUrl}`);

  return proxyUrl;
}
