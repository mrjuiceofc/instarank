import type { PasswordResetDTO } from './dto';
import type { passwordResetAttempt } from '@prisma/client';
import { BaseError } from '../../errors';
import prisma from '../../lib/prisma';

export async function passwordReset({ requestId, token }: PasswordResetDTO) {
  let requestPasswordReset: passwordResetAttempt;

  try {
    requestPasswordReset = await prisma.passwordResetAttempt.findFirst({
      where: {
        id: token,
      },
      include: {
        user: true,
      },
    });
  } catch (error) {
    throw new BaseError({
      message:
        'Erro desconhecido ao buscar a tentativa de redefinição de senha',
      errorLocationCode:
        'passwordReset.ts:passwordReset:prisma.passwordResetAttempt.findFirst',
      requestId,
      statusCode: 500,
    });
  }

  if (!requestPasswordReset) {
    throw new BaseError({
      message: 'Tentativa de redefinição de senha não encontrada',
      errorLocationCode:
        'passwordReset.ts:passwordReset:prisma.passwordResetAttempt.findFirst',
      requestId,
      statusCode: 404,
    });
  }

  if (requestPasswordReset.deletedAt) {
    throw new BaseError({
      message: 'Redefinição de senha já foi utilizada ou foi cancelada',
      errorLocationCode:
        'passwordReset.ts:passwordReset:prisma.passwordResetAttempt.findFirst',
      requestId,
      statusCode: 400,
    });
  }

  if (requestPasswordReset.expiredAt < new Date()) {
    throw new BaseError({
      message: 'Tentativa de redefinição de senha expirou',
      errorLocationCode:
        'passwordReset.ts:passwordReset:prisma.passwordResetAttempt.findFirst',
      requestId,
      statusCode: 400,
    });
  }

  try {
    await prisma.user.update({
      where: {
        id: requestPasswordReset.userId,
      },
      data: {
        password: requestPasswordReset.password,
      },
    });
  } catch (error) {
    throw new BaseError({
      message: 'Erro desconhecido ao atualizar a senha do usuário',
      errorLocationCode: 'passwordReset.ts:passwordReset:prisma.user.update',
      requestId,
      statusCode: 500,
    });
  }

  try {
    await prisma.passwordResetAttempt.update({
      where: {
        id: requestPasswordReset.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  } catch (error) {
    throw new BaseError({
      message:
        'Erro desconhecido ao deletar a tentativa de redefinição de senha',
      errorLocationCode:
        'passwordReset.ts:passwordReset:prisma.passwordResetAttempt.delete',
      requestId,
      statusCode: 500,
    });
  }

  return {
    message: 'Senha atualizada com sucesso',
  };
}
