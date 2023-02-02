import { Prisma } from '@prisma/client';

declare const process: any;

export const plans: Prisma.planCreateInput[] = [
  {
    id: '9225c56e-5344-4c57-b640-51940a337961',
    name: 'premium',
    gatewayId:
      process.env.VERCEL_ENV === 'production'
        ? 'price_1MX0xzHjyj22ql7XWTq9OxBt'
        : 'price_1MVykWHjyj22ql7XKhe44ulX',
    monthlyLimit: 10000,
    price: 1599,
    requireCard: true,
  },
  {
    id: '161d1cc4-7eab-472f-a110-d677a1b0aca3',
    name: 'free',
    monthlyLimit: 50,
    requireCard: false,
    price: 0,
  },
];
