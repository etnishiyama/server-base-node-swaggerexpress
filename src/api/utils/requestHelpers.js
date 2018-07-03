import httpStatus from 'http-status';
import {
  AlreadyUsedEntityError,
  EntityNotFound,
  EntityNotFoundOnBody,
  InvalidFormatIdError,
  InvalidLocationError,
  NotAuthorizedError,
  UknownServerError,
  ValidationError,
} from '../errors/knownErrors';

function sendResErrorStatus(res, err) {
  console.log(`sendResErrorStatus, err: ${JSON.stringify(err)}`);
  res.status(err.status).json({
    message: err.message,
    error_code: err.errorCode,
  }).end();
}

function throwUnknownError(res, err) {
  console.log(`throwUnknownError, err: ${JSON.stringify(err)}`);
  if (err) {
    return res.status(500).json({
      message: err,
    });
  }
  return Promise.reject(new UknownServerError());
}

function throwKnownError(res, err) {
  console.log(`throwKnownError, err: ${JSON.stringify(err)}`);
  switch (err.name) {
    case 'CastError':
      if (err.kind === 'ObjectId') {
        sendResErrorStatus(res, new InvalidFormatIdError());
      } else {
        throwUnknownError(res, err);
      }
      break;
    case 'ValidationError':
      if (err.kind === 'ObjectId') {
        sendResErrorStatus(res, new ValidationError(err.message));
      } else {
        throwUnknownError(res, err);
      }
      break;
    case 'MongoError':
      switch (err.code) {
        case 11000:
          sendResErrorStatus(res, new AlreadyUsedEntityError());
          break;
        case 13068:
          sendResErrorStatus(res, new InvalidLocationError());
          break;
        default:
          throwUnknownError(res, err);
      }
      break;
    default:
      throwUnknownError(res, err);
  }
  return Promise.reject(new UknownServerError());
}

function respondWithResult(res, statusCode) {
  return (result) => {
    console.log(`respondWithResult, result: ${JSON.stringify(result)}, statusCode: ${statusCode}`);
    if (result) {
      let response;
      if (result.docs) {
        response = result;
        response.data = result.docs;
        delete response.docs;
      } else {
        response = {
          data: result,
        };
      }
      return res.status(statusCode || httpStatus.OK).json(response);
    }
    return Promise.reject(new UknownServerError());
  };
}

function respondWithData(res, dataRes, statusCode) {
  console.log(`respondWithData, data: ${JSON.stringify(dataRes)}, statusCode: ${statusCode}`);
  if (dataRes) {
    const data = {
      data: dataRes,
    };
    return res.status(statusCode || httpStatus.OK).json(data);
  }
  return Promise.reject(new UknownServerError());
}

function respondWithDeletedMessage(res) {
  console.log('respondWithDeletedMessage');
  return () => {
    const message = {
      data: 'Entity removed',
    };
    return res.status(httpStatus.OK).json(message);
  };
}

function handleError(res) {
  return (err) => {
    console.log(`handleError: ${JSON.stringify(err)}`);
    if (err.errorCode) {
      return sendResErrorStatus(res, err);
    }
    return throwKnownError(res, err);
  };
}

function handleEntityNotFound() {
  return (entity) => {
    console.log(`handleError: ${JSON.stringify(entity)}`);
    if (!entity) {
      return Promise.reject(new EntityNotFound());
    }
    return entity;
  };
}

function handleInvalidBodyEntity(modelName) {
  console.log(`handleInvalidBodyEntity: ${modelName}`);
  return (entity) => {
    if (!entity) {
      return Promise.reject(new EntityNotFoundOnBody(modelName));
    }
    return entity;
  };
}

function notAuthorized(res) {
  sendResErrorStatus(res, new NotAuthorizedError());
}

export {
  handleError,
  handleEntityNotFound,
  respondWithResult,
  respondWithData,
  respondWithDeletedMessage,
  handleInvalidBodyEntity,
  notAuthorized,
};
