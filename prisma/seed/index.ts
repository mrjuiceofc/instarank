import { PrismaClient } from '@prisma/client';
import { plans } from './data/plans';

const prisma = new PrismaClient();

const main = async () => {
  await plansSeed();
};

const plansSeed = async () => {
  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { id: plan.id },
      update: plan,
      create: plan,
    });
    console.log(`Created or updated plan ${plan.name} with id ${plan.id}`);
  }
};

main();
