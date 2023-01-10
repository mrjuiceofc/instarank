import type { NextApiRequest } from 'next';

export type CreateCheckoutSessionDTO = {
  planName: string;
  userId: string;
  requestId: string;
};

export type ChangePlanBySessionIdDTO = {
  sessionId: string;
  requestId: string;
};

export type ProcessWebhookDTO = {
  request: NextApiRequest;
  eventName: string;
};
