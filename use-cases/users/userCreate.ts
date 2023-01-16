import { plan, user } from '@prisma/client';
import { BaseError } from '../../errors';
import prisma from '../../lib/prisma';
import { UserCreateOrUpdateDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { userAuth } from './userAuth';

export async function userCreate({
  email,
  password,
  requestId,
  ip,
  utmSource,
  utmMedium,
  utmCampaign,
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
      message: 'Erro desconhecido ao buscar usuário',
      errorLocationCode: 'userCreate.ts:userCreate:prisma.user.findUnique',
      requestId,
      statusCode: 500,
    });
  }

  if (userAlreadyExists) {
    const secretEmail = userAlreadyExists.email.replace(/(?<=.).(?=.*@)/g, '*');
    throw new BaseError({
      message: `Já existe um usuário com o email ${secretEmail}`,
      errorLocationCode: 'userCreate.ts:userCreate:userAlreadyExists',
      requestId,
      statusCode: 400,
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
      message: 'Erro desconhecido ao buscar usuários com mesmo IP',
      errorLocationCode: 'userCreate.ts:userCreate:prisma.user.findFirst',
      requestId,
      statusCode: 500,
    });
  }

  if (userWithSameIp) {
    const secretEmail = userWithSameIp.email.replace(/(?<=.).(?=.*@)/g, '*');
    throw new BaseError({
      message: `O usuário com o email ${secretEmail} já está cadastrado com esse IP`,
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
      message: 'Erro desconhecido ao gerar hash da senha',
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
      message: 'Erro desconhecido ao buscar o plano',
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
        utmSource,
        utmMedium,
        utmCampaign,
      },
    });
  } catch (error) {
    throw new BaseError({
      message: 'Erro desconhecido ao criar usuário',
      errorLocationCode: 'userCreate.ts:userCreate:prisma.user.create',
      requestId,
      statusCode: 500,
    });
  }

  return await userAuth({
    email,
    password,
    requestId,
    ip,
  });
}
