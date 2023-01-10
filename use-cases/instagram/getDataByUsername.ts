import { BaseError } from '../../errors';
import { GetDataByUsernameDTO } from './dto';
import axios from 'axios';

export async function getDataByUsername({
  requestId,
  username,
}: GetDataByUsernameDTO) {
  if (!process.env.SCRAPE_API_KEY) {
    throw new BaseError({
      message: 'Chave de API do ScrapingBee não encontrada',
      requestId,
      statusCode: 500,
      errorLocationCode: 'instagram.getDataByUsername',
    });
  }

  try {
    const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
    const { data } = await axios.get(
      `http://api.scrape.do?token=${process.env.SCRAPE_API_KEY}&url=${url}&customHeaders=true`,
      {
        headers: {
          'x-ig-app-id': '936619743392459',
        },
      }
    );

    const user = data.data.user;

    return {
      id: user.id,
      username: user.username,
      fullName: user.full_name,
      biography: user.biography,
      profilePicUrl: user.profile_pic_url,
      bio_links: user.bio_links,
      followers: user.edge_followed_by.count,
      following: user.edge_follow.count,
    };
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
