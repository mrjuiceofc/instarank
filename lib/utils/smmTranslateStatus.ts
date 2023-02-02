import { order_status } from '@prisma/client';

export const smmTranslateStatus: {
  [key: string]: order_status;
} = {
  Pending: 'PENDING',
  'In progress': 'IN_PROGRESS',
  Completed: 'COMPLETED',
  Partial: 'PARTIAL',
  Processing: 'PROCESSING',
  Canceled: 'CANCELLED',
};
