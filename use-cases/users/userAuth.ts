import { user } from '@prisma/client';
import { BaseError } from '../../errors';
import prisma from '../../lib/prisma';
import { UserCreateOrUpdateDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { tokenGenerate } from './tokenGenerate';
import { handleLimitReset } from './handleLimitReset';

export async function userAuth({
  email,
  password,
  requestId,
  ip,
}: UserCreateOrUpdateDTO) {
  let user: user;
  try {
    user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
  } catch (error) {
    throw new BaseError({
      message: error.message,
      errorLocationCode: 'userAuth.ts:userAuth:prisma.user.findUnique',
      requestId,
      statusCode: 500,
    });
  }

  if (!user) {
    throw new BaseError({
      message: 'Password or email is incorrect',
      errorLocationCode: 'userAuth.ts:userAuth:prisma.user.findUnique',
      requestId,
      statusCode: 403,
    });
  }

  const passwordMatch = bcrypt.compareSync(password, user.password);

  if (!passwordMatch) {
    throw new BaseError({
      message: 'Password or email is incorrect',
      errorLocationCode: 'userAuth.ts:userAuth:bcrypt.compareSync',
      requestId,
      statusCode: 403,
    });
  }

  try {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ip,
        lastAccessAt: new Date(),
      },
    });
  } catch (error) {
    throw new BaseError({
      message: error.message,
      errorLocationCode: 'userAuth.ts:userAuth:prisma.user.update',
      requestId,
      statusCode: 500,
    });
  }

  try {
    await handleLimitReset({
      requestId,
      userId: user.id,
    });
  } catch (error) {
    throw new BaseError({
      message: error.message,
      errorLocationCode: 'userAuth.ts:userAuth:handleLimitReset',
      requestId,
      statusCode: 500,
    });
  }

  return await tokenGenerate({
    email,
    requestId,
  });
}
