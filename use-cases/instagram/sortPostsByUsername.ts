import { SortPostsByUsernameDTO } from './dto';
import { getDataByUsername } from './getDataByUsername';

export async function sortPostsByUsername({
  requestId,
  userId,
  username,
  sortBy,
  only,
  fromDate,
  untilDate,
  postsLimit,
}: SortPostsByUsernameDTO) {
  const ig = await getDataByUsername({
    requestId,
    username,
    postsLimit,
    fromDate,
    untilDate,
    only,
  });

  const posts = ig.posts.sort((a, b) => {
    if (sortBy === 'likes') {
      return b.likes - a.likes;
    }

    if (sortBy === 'comments') {
      return b.comments - a.comments;
    }

    if (sortBy === 'date') {
      return b.publicationDate.getTime() - a.publicationDate.getTime();
    }

    return 0;
  });

  return {
    posts,
    user: ig.user,
  };
}
