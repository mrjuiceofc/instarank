import { BaseError } from '../../../errors';
import prisma from '../../../lib/prisma';
import { CreateWarningDTO } from './dto';

export async function createWarning({
  userId,
  requestId,
  title,
  message,
  actionUrl,
  actionText,
}: CreateWarningDTO) {
  try {
    await prisma.warning.create({
      data: {
        userId,
        title,
        message,
        actionUrl,
        actionText,
      },
    });
  } catch (error) {
    throw new BaseError({
      message: 'Erro desconhecido ao criar aviso',
      errorLocationCode: 'createWarning.ts:createWarning:prisma.warning.create',
      requestId,
      statusCode: 500,
    });
  }
}
