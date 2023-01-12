import { BaseError } from '../../errors';
import { GetDataByUsernameDTO } from './dto';
import axios from 'axios';

export async function getDataByUsername({
  requestId,
  username,
}: GetDataByUsernameDTO) {
  console.log(
    `[getDataByUsername] Buscando dados do instagram do usuário ${username}...`
  );

  if (!process.env.SCRAPE_API_KEY) {
    console.log('Chave de API do ScrapingBee não encontrada');
    throw new BaseError({
      message: 'Chave de API do ScrapingBee não encontrada',
      requestId,
      statusCode: 500,
      errorLocationCode: 'instagram.getDataByUsername',
    });
  }

  try {
    const igUrl = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
    const url = ['preview', 'production'].includes(process.env.VERCEL_ENV)
      ? `http://api.scrape.do?token=${process.env.SCRAPE_API_KEY}&url=${igUrl}&customHeaders=true`
      : igUrl;

    console.log(`[getDataByUsername] fetch url: ${url}`);
    const { data } = await axios.get(url, {
      headers: {
        'x-ig-app-id': '936619743392459',
      },
    });

    const user = data.data.user;

    console.log(
      `[getDataByUsername] Dados do instagram do usuário ${username} buscados com sucesso`
    );

    console.log(user);

    // return data;
  } catch (error) {
    if (error.response && error.response.data) {
      console.log(error.response.data);
    } else {
      console.log(error);
    }
    throw new BaseError({
      message: 'Erro desconhecido ao buscar dados do instagram do usuário',
      requestId,
      statusCode: 500,
      errorLocationCode: 'instagram.getDataByUsername',
    });
  }
}
