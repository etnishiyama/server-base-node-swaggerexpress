import httpStatus from 'http-status';
import AppError from './appError';

export class DeleteEntityError extends AppError {
  constructor(message) {
    super(message || 'Delete entity error.', 'ENTITY_DELETED_ERROR', httpStatus.BAD_REQUEST);
  }
}

export class EntityNotFound extends AppError {
  constructor() {
    super('Entity not found.', 'ENTITY_NOT_FOUND', httpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class EntityNotFoundOnBody extends AppError {
  constructor(collectionName) {
    let message;
    if (collectionName) {
      message = `Could not find entity in ${collectionName} collection.`;
    } else {
      message = 'Entity not found.';
    }
    super(message, 'ENTITY_ON_BODY_NOT_FOUND', httpStatus.BAD_REQUEST);
  }
}

export class InvalidFormatIdError extends AppError {
  constructor() {
    super('Invalid format id.', 'INVALID_FORMAT_ID', httpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class AlreadyUsedEntityError extends AppError {
  constructor() {
    super('Entity already used.', 'ENTITY_ALREADY_USED', httpStatus.CONFLICT);
  }
}

export class InvalidLocationError extends AppError {
  constructor() {
    super('Entity already used.', 'ENTITY_ALREADY_USED', httpStatus.BAD_REQUEST);
  }
}

export class NotAuthorizedError extends AppError {
  constructor() {
    super('Error: Access Denied.', 'UNAUTHORIZED_ACCESS', httpStatus.UNAUTHORIZED);
  }
}

export class CompanyNotFoundError extends AppError {
  constructor() {
    super('Error: Company details not found.', 'UNAUTHORIZED_ACCESS', httpStatus.UNAUTHORIZED);
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message || 'Validation error.', 'VALIDATION_ERROR', httpStatus.BAD_REQUEST);
  }
}

export class UknownServerError extends AppError {
  constructor() {
    super('Unknown server error.', 'UNKNOWN_SERVER_ERROR', httpStatus.INTERNAL_SERVER_ERROR);
  }
}
