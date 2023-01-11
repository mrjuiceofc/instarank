export type GetWarningsFromUserIdDTO = {
  userId: string;
  requestId: string;
};

export type MarkWarningAsReadDTO = {
  userId: string;
  requestId: string;
  warningId: string;
};

export type CreateWarningDTO = {
  requestId: string;
  userId: string;
  title: string;
  message: string;
  actionText: string;
  actionUrl: string;
};
