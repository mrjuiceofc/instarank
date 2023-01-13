import { BaseError } from '../../errors';
import { getInstagramClient } from '../../lib/get-instagram-client';
import { GetDataByUsernameDTO, InstagramPost, InstagramUser } from './dto';

const client = getInstagramClient();

const DEFAULT_MAX_POSTS = 33;
const MAX_REQUESTS = 10;

export async function getDataByUsername({
  requestId,
  username,
  postsLimit,
  fromDate,
  untilDate,
  only,
}: GetDataByUsernameDTO) {
  console.log(
    `[getDataByUsername] Buscando dados do instagram do usuário ${username}...`
  );

  let user: InstagramUser;
  const posts: InstagramPost[] = [];
  let maxId: string;
  let maxPosts = DEFAULT_MAX_POSTS;
  let hasMore = true;
  let amountOfPostsMissing = postsLimit;
  let requestCount = 0;
  let forceStop = false;

  try {
    while (
      hasMore &&
      amountOfPostsMissing > 0 &&
      requestCount < MAX_REQUESTS &&
      !forceStop
    ) {
      maxPosts =
        amountOfPostsMissing > maxPosts ? maxPosts : amountOfPostsMissing;

      console.log(
        `[getDataByUsername] buscando por posts na página ${
          requestCount + 1
        }...`
      );
      const { data } = await client.get(
        `https://www.instagram.com/api/v1/feed/user/${username}/username?count=${maxPosts}${
          maxId ? `&max_id=${maxId}` : ''
        }`
      );

      requestCount++;
      hasMore = data.more_available;
      maxId = data.next_max_id;

      if (!user) {
        user = {
          username: data.user.username,
          profileImage: data.user.profile_pic_url,
        };
      }

      posts.push(
        ...data.items
          .map((item) => {
            return {
              likes: item.like_count,
              comments: item.comment_count,
              igUrl: `https://www.instagram.com/p/${item.code}`,
              files: item.carousel_media
                ? item.carousel_media.map(
                    (i) => i.image_versions2.candidates[0].url
                  )
                : [item.image_versions2.candidates[0].url],
              type: item.media_type === 1 ? 'posts' : 'reels',
              publicationDate: new Date(item.taken_at * 1000),
            };
          })
          .filter((post) => {
            if (only === 'posts' && post.type !== 'posts') {
              return false;
            }

            if (only === 'reels' && post.type !== 'reels') {
              return false;
            }

            if (fromDate && post.publicationDate < fromDate) {
              forceStop = true;
              return false;
            }

            if (untilDate && post.publicationDate > untilDate) {
              return false;
            }

            return true;
          })
      );

      amountOfPostsMissing = postsLimit - posts.length;
    }
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

  console.log(
    `[getDataByUsername] ${posts.length} posts encontrados${
      user ? ` do usuário ${user.username}` : ''
    }`
  );

  return { user, posts };
}
