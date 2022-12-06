export type SendEmailDTO = {
  to: string;
  subject: string;
  variables: { [key: string]: string };
  template: string;
  requestId: string;
};
