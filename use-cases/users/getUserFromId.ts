import { plan, Prisma } from '@prisma/client';
import { BaseError } from '../../errors';
import prisma from '../../lib/prisma';
import { GetUserFromIdDTO } from './dto';

export type user = {
  id: string;
  email: string;
  ip: string;
  updatedAt: Date;
  plan: plan;
  createdAt: Date;
  monthlyLimit: number;
  limitResetAt: Date;
  lastAccessAt: Date;
  sawSuccessPlanAt?: Date;
  deletedAt?: Date;
};

export async function getUserFromId({ userId, requestId }: GetUserFromIdDTO) {
  let user: user;
  try {
    user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        ip: true,
        updatedAt: true,
        plan: true,
        createdAt: true,
        monthlyLimit: true,
        limitResetAt: true,
        lastAccessAt: true,
        sawSuccessPlanAt: true,
        deletedAt: true,
      },
    });
  } catch (error) {
    throw new BaseError({
      message: 'Erro desconhecido ao buscar usuário',
      errorLocationCode:
        'getUserFromId.ts:getUserFromId:prisma.user.findUnique',
      requestId,
      statusCode: 500,
    });
  }

  if (!user) {
    throw new BaseError({
      message: 'Usuário não encontrado',
      errorLocationCode:
        'getUserFromId.ts:getUserFromId:prisma.user.findUnique',
      requestId,
      statusCode: 404,
    });
  }

  return user;
}
