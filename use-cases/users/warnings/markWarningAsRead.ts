import { user, warning } from '@prisma/client';
import { BaseError } from '../../../errors';
import prisma from '../../../lib/prisma';
import { MarkWarningAsReadDTO } from './dto';

export async function markWarningAsRead({
  userId,
  requestId,
  warningId,
}: MarkWarningAsReadDTO) {
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
        'markWarningAsRead.ts:markWarningAsRead:prisma.user.findFirst',
      requestId,
      statusCode: 500,
    });
  }

  if (!user) {
    throw new BaseError({
      message: 'Usuário não encontrado',
      errorLocationCode: 'markWarningAsRead.ts:markWarningAsRead:user',
      requestId,
      statusCode: 404,
    });
  }

  let warning: warning;
  try {
    warning = await prisma.warning.findFirst({
      where: {
        id: warningId,
        deletedAt: null,
      },
    });
  } catch (error) {
    throw new BaseError({
      message: 'Erro desconhecido ao buscar avisos',
      errorLocationCode:
        'markWarningAsRead.ts:markWarningAsRead:prisma.warning.findFirst',
      requestId,
      statusCode: 500,
    });
  }

  if (!warning) {
    throw new BaseError({
      message: 'Aviso não encontrado',
      errorLocationCode: 'markWarningAsRead.ts:markWarningAsRead:warning',
      requestId,
      statusCode: 404,
    });
  }

  if (warning.userId !== user.id) {
    throw new BaseError({
      message: 'Aviso não pertence ao usuário',
      errorLocationCode: 'markWarningAsRead.ts:markWarningAsRead:warning',
      requestId,
      statusCode: 403,
    });
  }

  if (warning.seenAt) {
    return {
      message: 'Aviso já marcado como lido',
    };
  }

  try {
    warning = await prisma.warning.update({
      where: {
        id: warning.id,
      },
      data: {
        seenAt: new Date(),
      },
    });
  } catch (error) {
    throw new BaseError({
      message: 'Erro desconhecido ao marcar aviso como lido',
      errorLocationCode:
        'markWarningAsRead.ts:markWarningAsRead:prisma.warning.update',
      requestId,
      statusCode: 500,
    });
  }

  return {
    message: 'Aviso marcado como lido',
  };
}
