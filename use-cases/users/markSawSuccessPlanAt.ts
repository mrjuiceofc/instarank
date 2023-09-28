import { plan } from '@prisma/client';
import { BaseError } from '../../errors';
import prisma from '../../lib/prisma';
import { MarkSawSuccessPlanAtDTO } from './dto';

export async function markSawSuccessPlanAt({
  userId,
  requestId,
}: MarkSawSuccessPlanAtDTO) {
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        sawSuccessPlanAt: new Date(),
      },
    });
    return {
      message: 'Atualizado com sucesso',
    };
  } catch (error) {
    throw new BaseError({
      message: 'Erro desconhecido',
      errorLocationCode: 'markSawSuccessPlanAt.ts',
      requestId,
      statusCode: 500,
    });
  }
}
