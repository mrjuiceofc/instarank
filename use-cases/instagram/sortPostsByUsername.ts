import { user } from '@prisma/client';
import { BaseError } from '../../errors';
import prisma from '../../lib/prisma';
import { InstagramPost, SortPostsByUsernameDTO } from './dto';
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
  const isValid = validParams({
    requestId,
    userId,
    username,
    sortBy,
    only,
    fromDate,
    untilDate,
    postsLimit,
  });

  if (!isValid) {
    throw new BaseError({
      message: 'Os parâmetros informados são inválidos',
      requestId,
      statusCode: 400,
      errorLocationCode: 'sortPostsByUsername.ts:sortPostsByUsername',
    });
  }

  let user: user;
  try {
    user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  } catch (error) {
    throw new BaseError({
      message: 'Ocorreu um erro ao buscar os posts do usuário',
      requestId,
      statusCode: 500,
      errorLocationCode:
        'sortPostsByUsername.ts:sortPostsByUsername:prisma.user.findUnique',
    });
  }

  if (!user) {
    throw new BaseError({
      message: 'Usuário não encontrado',
      requestId,
      statusCode: 404,
      errorLocationCode:
        'sortPostsByUsername.ts:sortPostsByUsername:prisma.user.findUnique',
    });
  }

  if (user.monthlyLimit < postsLimit) {
    throw new BaseError({
      message: 'A quantidade de posts informada é maior que o limite mensal',
      requestId,
      statusCode: 400,
      errorLocationCode:
        'sortPostsByUsername.ts:sortPostsByUsername:prisma.user.findUnique',
    });
  }

  const ig = await getDataByUsername({
    requestId,
    username,
    postsLimit,
    fromDate,
    untilDate,
    only,
  });

  const posts = sortPosts(ig.posts, sortBy);

  const postAmount = posts.length;

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        monthlyLimit: {
          decrement: postAmount,
        },
      },
    });
  } catch (error) {
    throw new BaseError({
      message: 'Ocorreu um erro ao atualizar o limite mensal',
      requestId,
      statusCode: 500,
      errorLocationCode:
        'sortPostsByUsername.ts:sortPostsByUsername:prisma.user.update',
    });
  }

  try {
    await prisma.ordinance.create({
      data: {
        instagramUsername: username,
        fromDate,
        untilDate,
        user: {
          connect: {
            id: userId,
          },
        },
        sortBy,
        onlyType: only,
        postLimit: postsLimit,
      },
    });
  } catch (error) {
    console.log(
      `[sortPostsByUsername - ${requestId}] Erro ao salvar a ordem ${error} | esse erro não afetou o resultado da requisição`
    );
  }

  return {
    user: ig.user,
    postAmount,
    posts,
  };
}

function sortPosts(
  posts: InstagramPost[],
  sortBy: SortPostsByUsernameDTO['sortBy']
) {
  return posts.sort((a, b) => {
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
}

function validParams({
  requestId,
  userId,
  username,
  sortBy,
  only,
  fromDate,
  untilDate,
  postsLimit,
}: SortPostsByUsernameDTO) {
  if (!userId)
    throw new BaseError({
      message: 'O id do usuário não foi informado',
      requestId,
      statusCode: 400,
      errorLocationCode: 'sortPostsByUsername.ts:validParams',
    });

  if (!username)
    throw new BaseError({
      message: 'O nome de usuário não foi informado',
      requestId,
      statusCode: 400,
      errorLocationCode: 'sortPostsByUsername.ts:validParams',
    });

  if (!sortBy)
    throw new BaseError({
      message: 'O tipo de ordenação não foi informado',
      requestId,
      statusCode: 400,
      errorLocationCode: 'sortPostsByUsername.ts:validParams',
    });

  if (!only)
    throw new BaseError({
      message: 'O tipo de post não foi informado',
      requestId,
      statusCode: 400,
      errorLocationCode: 'sortPostsByUsername.ts:validParams',
    });

  if (!postsLimit && postsLimit < 1)
    throw new BaseError({
      message: 'O limite de posts não é válido',
      requestId,
      statusCode: 400,
      errorLocationCode: 'sortPostsByUsername.ts:validParams',
    });

  if (!fromDate)
    throw new BaseError({
      message: 'A data inicial não foi informada',
      requestId,
      statusCode: 400,
      errorLocationCode: 'sortPostsByUsername.ts:validParams',
    });

  if (!untilDate)
    throw new BaseError({
      message: 'A data final não foi informada',
      requestId,
      statusCode: 400,
      errorLocationCode: 'sortPostsByUsername.ts:validParams',
    });

  if (fromDate > untilDate)
    throw new BaseError({
      message: 'A data inicial não pode ser maior que a data final',
      requestId,
      statusCode: 400,
      errorLocationCode: 'sortPostsByUsername.ts:validParams',
    });

  if (fromDate > new Date())
    throw new BaseError({
      message: 'A data inicial não pode ser maior que a data atual',
      requestId,
      statusCode: 400,
      errorLocationCode: 'sortPostsByUsername.ts:validParams',
    });

  if (untilDate > new Date())
    throw new BaseError({
      message: 'A data final não pode ser maior que a data atual',
      requestId,
      statusCode: 400,
      errorLocationCode: 'sortPostsByUsername.ts:validParams',
    });

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  if (fromDate < oneMonthAgo)
    throw new BaseError({
      message: 'A data inicial não pode ser menor que um mês atrás',
      requestId,
      statusCode: 400,
      errorLocationCode: 'sortPostsByUsername.ts:validParams',
    });

  if (sortBy !== 'likes' && sortBy !== 'comments' && sortBy !== 'date')
    throw new BaseError({
      message: 'O tipo de ordenação é inválido',
      requestId,
      statusCode: 400,
      errorLocationCode: 'sortPostsByUsername.ts:validParams',
    });

  if (only !== 'posts' && only !== 'reels' && only !== 'all')
    throw new BaseError({
      message: 'O tipo de post é inválido',
      requestId,
      statusCode: 400,
      errorLocationCode: 'sortPostsByUsername.ts:validParams',
    });

  if (postsLimit > 60)
    throw new BaseError({
      message: 'O limite de posts máximo por vez é 60',
      requestId,
      statusCode: 400,
      errorLocationCode: 'sortPostsByUsername.ts:validParams',
    });

  return true;
}
