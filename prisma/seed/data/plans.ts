import { Prisma } from '@prisma/client';

declare const process: any;

export const plans: Prisma.planCreateInput[] = [
  {
    id: '9225c56e-5344-4c57-b640-51940a337961',
    name: 'premium',
    gatewayId:
      process.env.VERCEL_ENV === 'production'
        ? 'price_1MMcYxHjyj22ql7XzAnT2s4C'
        : 'price_1LyLy5Hjyj22ql7XkcJuEYib',
    monthlyLimit: 3000,
    price: 999,
    requireCard: true,
  },
  {
    id: '161d1cc4-7eab-472f-a110-d677a1b0aca3',
    name: 'free',
    monthlyLimit: 10,
    requireCard: false,
    price: 0,
  },
];
