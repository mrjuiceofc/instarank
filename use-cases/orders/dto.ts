export type OrderFollowersDTO = {
  requestId: string;
  username: string;
  amount: number;
  userId: string;
};

export type SMMOrder = {
  charge: string;
  start_count: number;
  status: string;
  remains: number;
  currency: string;
};

export type UpdateNotCompletedOrdersDTO = {
  requestId: string;
};

export type FindOrdersByUserIdDTO = {
  requestId: string;
  userId: string;
};
