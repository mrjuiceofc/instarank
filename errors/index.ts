import { v4 as uuid } from 'uuid';

type BaseErrorConstructor = {
  requestId: string;
  message: string;
  errorLocationCode: string;
  statusCode?: number;
  errorId?: string;
};

export class BaseError extends Error {
  statusCode: number;
  errorId: string;
  requestId: string;
  errorLocationCode: string;

  constructor({
    message,
    statusCode,
    errorId,
    requestId,
    errorLocationCode,
  }: BaseErrorConstructor) {
    super();
    this.name = this.constructor.name;
    this.message = message;
    this.statusCode = statusCode || 500;
    this.errorId = errorId || uuid();
    this.requestId = requestId;
    this.errorLocationCode = errorLocationCode;
  }
}
