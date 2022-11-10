import { plan, user } from '@prisma/client';
import { BaseError } from '../../errors';
import prisma from '../../lib/prisma';
import { UserCreateOrUpdateDTO } from './dto';
import { userAuth } from './userAuth';
import * as bcrypt from 'bcrypt';

export async function userCreate({
  email,
  password,
  requestId,
  ip,
}: UserCreateOrUpdateDTO) {
  let userAlreadyExists: user;
  try {
    userAlreadyExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });
  } catch (error) {
    throw new BaseError({
      message: error.message,
      errorLocationCode: 'userCreate.ts:userCreate:prisma.user.findUnique',
      requestId,
      statusCode: 500,
    });
  }

  if (userAlreadyExists) {
    return await userAuth({
      email,
      password,
      requestId,
      ip,
    });
  }

  let userWithSameIp: user;
  try {
    userWithSameIp = await prisma.user.findFirst({
      where: {
        ip,
      },
    });
  } catch (error) {
    throw new BaseError({
      message: error.message,
      errorLocationCode: 'userCreate.ts:userCreate:prisma.user.findFirst',
      requestId,
      statusCode: 500,
    });
  }

  if (userWithSameIp) {
    const secretEmail = userWithSameIp.email.replace(/(?<=.).(?=.*@)/g, '*');
    throw new BaseError({
      message: `User with the email ${secretEmail} has already registered with this IP address`,
      errorLocationCode: 'userCreate.ts:userCreate:prisma.user.findFirst',
      requestId,
      statusCode: 400,
    });
  }

  let hashPassword: string;
  try {
    const salt = await bcrypt.genSalt(10);
    hashPassword = await bcrypt.hash(password, salt);
  } catch (error) {
    throw new BaseError({
      message: error.message,
      errorLocationCode: 'userCreate.ts:userCreate:bcrypt.hash',
      requestId,
      statusCode: 500,
    });
  }

  let freePlan: plan;
  try {
    freePlan = await prisma.plan.findFirst({
      where: {
        name: 'free',
      },
    });
  } catch (error) {
    throw new BaseError({
      message: error.message,
      errorLocationCode: 'userCreate.ts:userCreate:prisma.plan.findUnique',
      requestId,
      statusCode: 500,
    });
  }

  try {
    await prisma.user.create({
      data: {
        email,
        password: hashPassword,
        ip,
        planId: freePlan.id,
        monthlyLimit: freePlan.monthlyLimit,
        lastAccessAt: new Date(),
        limitResetAt: new Date(),
      },
    });
  } catch (error) {
    throw new BaseError({
      message: error.message,
      errorLocationCode: 'userCreate.ts:userCreate:prisma.user.create',
      requestId,
      statusCode: 500,
    });
  }

  const { token, refreshToken } = await userAuth({
    email,
    password,
    requestId,
    ip,
  });

  return {
    token,
    refreshToken,
  };
}
