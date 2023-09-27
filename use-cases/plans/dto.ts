import type { NextApiRequest } from 'next';

export type CreateCheckoutSessionDTO = {
  planName: string;
  userId: string;
  requestId: string;
};

export type ChangePlanByWebhookObjectDTO = {
  object: any;
  requestId: string;
};

export type ProcessWebhookDTO = {
  request: NextApiRequest;
};

export type DowngradePlanDTO = {
  requestId: string;
  object: any;
};
