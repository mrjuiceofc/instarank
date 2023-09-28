export type UserCreateOrUpdateDTO = {
  email: string;
  password: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
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
  forceNow?: boolean;
};

export type GetUserFromIdDTO = {
  userId: string;
  requestId: string;
};

export type MarkSawSuccessPlanAtDTO = {
  userId: string;
  requestId: string;
};

export type RequestPasswordResetDTO = {
  requestId: string;
  ip: string;
  email: string;
  newPassword: string;
};

export type PasswordResetDTO = {
  requestId: string;
  ip: string;
  token: string;
};
