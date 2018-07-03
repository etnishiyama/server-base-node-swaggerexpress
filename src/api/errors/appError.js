import httpStatus from 'http-status';

module.exports = class AppError extends Error {
  constructor(message, errorCode, status) {
    super(message);

    this.name = this.constructor.name;
    this.errorCode = errorCode;

    Error.captureStackTrace(this, this.constructor);

    this.status = status || httpStatus.INTERNAL_SERVER_ERROR;
  }
};
