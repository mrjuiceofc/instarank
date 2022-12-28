import { user, warning } from '@prisma/client';
import { BaseError } from '../../../errors';
import prisma from '../../../lib/prisma';
import { GetWarningsFromUserIdDTO } from '../dto';

export async function getWarningsFromUserId({
  userId,
  requestId,
}: GetWarningsFromUserIdDTO) {
  let user: user;
  try {
    user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
  } catch (error) {
    throw new BaseError({
      message: 'Erro desconhecido ao buscar usuário',
      errorLocationCode:
        'getWarningsFromUserId.ts:getWarningsFromUserId:prisma.user.findFirst',
      requestId,
      statusCode: 500,
    });
  }

  if (!user) {
    throw new BaseError({
      message: 'Usuário não encontrado',
      errorLocationCode: 'getWarningsFromUserId.ts:getWarningsFromUserId:user',
      requestId,
      statusCode: 404,
    });
  }

  let warnings: warning[];
  try {
    warnings = await prisma.warning.findMany({
      where: {
        userId,
        deletedAt: null,
        seenAt: null,
      },
    });
  } catch (error) {
    throw new BaseError({
      message: 'Erro desconhecido ao buscar avisos',
      errorLocationCode:
        'getWarningsFromUserId.ts:getWarningsFromUserId:prisma.warning.findMany',
      requestId,
      statusCode: 500,
    });
  }

  return warnings;
}
