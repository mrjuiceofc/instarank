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

export type GetUserFromIdDTO = {
  userId: string;
  requestId: string;
};

export type RequestPasswordResetDTO = {
  requestId: string;
  ip: string;
  email: string;
  newPassword: string;
};

export type SendEmailDTO = {
  to: string;
  subject: string;
  variables: { [key: string]: string };
  template: string;
  requestId: string;
};
