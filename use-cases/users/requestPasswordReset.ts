import { RequestPasswordResetDTO } from './dto';
import type { user } from '@prisma/client';
import prisma from '../../lib/prisma';
import { BaseError } from '../../errors';
import * as bcrypt from 'bcrypt';
import { sendEmail } from '../sendEmail';
import { sleep } from '../../lib/utils/sleep';

export async function requestPasswordReset({
  email,
  requestId,
  newPassword,
}: RequestPasswordResetDTO) {
  let user: user;
  try {
    user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
  } catch (error) {
    throw new BaseError({
      message: 'Erro desconhecido ao buscar usuário',
      errorLocationCode:
        'requestPasswordReset.ts:requestPasswordReset:prisma.user.findUnique',
      requestId,
      statusCode: 500,
    });
  }

  if (!user) {
    const randomMs = Math.floor(Math.random() * 3000);
    await sleep(randomMs);
    return {
      message:
        'Se o e-mail informado estiver cadastrado, você receberá um e-mail para confirmar a troca de senha.',
    };
  }

  let hashPassword: string;
  try {
    const salt = await bcrypt.genSalt(10);
    hashPassword = await bcrypt.hash(newPassword, salt);
  } catch (error) {
    throw new BaseError({
      message: 'Erro desconhecido ao gerar hash da senha',
      errorLocationCode: 'userCreate.ts:userCreate:bcrypt.hash',
      requestId,
      statusCode: 500,
    });
  }

  let passwordResetToken: string;
  try {
    const passwordRequest = await prisma.passwordResetAttempt.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        password: hashPassword,
        expiredAt: new Date(Date.now() + 1000 * 60 * 60),
      },
    });
    passwordResetToken = passwordRequest.id;
  } catch (error) {
    throw new BaseError({
      message: 'Erro desconhecido ao solicitar troca de senha',
      errorLocationCode:
        'requestPasswordReset.ts:requestPasswordReset:prisma.passwordResetAttempt.create',
      requestId,
      statusCode: 500,
    });
  }

  await sendEmail({
    template: 'PasswordReset',
    to: user.email,
    requestId,
    subject: 'Instarank - Solicitação de troca de senha',
    variables: {
      url: `${process.env.FRONTEND_URL}/password-reset?token=${passwordResetToken}`,
    },
  });

  return {
    message:
      'Se o e-mail informado estiver cadastrado, você receberá um e-mail para confirmar a troca de senha.',
  };
}
