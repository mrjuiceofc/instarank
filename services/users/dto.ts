export type UserCreateOrUpdateDTO = {
  email: string;
  password: string;
  ip: string;
  requestId: string;
};

export type TokenGenerateDTO = {
  requestId: string;
  email?: string;
  refreshToken?: string;
};

export type HandleLimitResetDTO = {
  userId: string;
  requestId: string;
};
