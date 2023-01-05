export type CreateCheckoutSessionDTO = {
  planName: string;
  userId: string;
  requestId: string;
};

export type ChangePlanBySessionIdDTO = {
  sessionId: string;
  requestId: string;
};
