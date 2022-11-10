import 'next';

declare module 'next' {
  export interface NextApiRequest {
    context: {
      requestId: string;
      clientIp: string;
      userId?: string;
    };
  }
}
