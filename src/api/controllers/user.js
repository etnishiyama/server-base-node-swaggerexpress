import User from '../../api/models/user';
import Company from '../../api/models/company';
import { generateToken } from '../utils/auth';
import patchUpdates from '../utils/mongoHelper';
import { CompanyNotFoundError, NotAuthorizedError } from '../errors/knownErrors';
import { handleUserNames, getFieldFromSmartDbResponse } from '../utils/utils';
import {
  handleEntityNotFound,
  handleError,
  respondWithData,
  respondWithDeletedMessage,
  respondWithResult,
} from '../utils/requestHelpers';
import dbsmart from '../../config/dbsmart';
import smartQueries from '../utils/sqlQuery';

// Gets a list of users
export function getUserList(req, res) {
  const pageNumber = req.swagger.params.page.value || 1;
  return User.paginate({}, { page: pageNumber })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a specific User by id
export function getUserById(req, res) {
  const populateQuery = [{
    path: 'dependents',
    model: User,
    select: '_id fullname role',
  }];

  return User.findById(req.swagger.params.id.value)
    .populate(populateQuery)
    .then(handleEntityNotFound())
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a User
export function postUserCreate(req, res) {
  const user = handleUserNames(req.body);

  return User.create(user)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// User authentication
export function postUserAuthenticate(req, res) {
  const reqPassword = req.body.password;
  const reqUsername = req.body.username;
  const appIdentifier = req.body.appIdentifier ? req.body.appIdentifier : 'error';
  const companyQuery = { appIdentifier: { $regex: appIdentifier } };
  const newQuery = smartQueries.QUERY_LOGIN.replace('$PARAM1', reqUsername);
  let loggedUser = {};
  const mongoPopulateQuery = [{
    path: '_company',
    model: Company,
  }, {
    path: 'dependents',
    model: User,
    select: '_id fullname role',
  }];

  return User.findOne({ username: reqUsername })
    .populate(mongoPopulateQuery)
    .then((userResult) => {
      if (userResult && userResult.comparePassword(reqPassword)) {
        const genToken = generateToken(userResult);
        const response = {
          _id: userResult._id,
          token: genToken,
          role: userResult.role,
          name: userResult.name,
          username: userResult.username,
          lastname: userResult.lastname,
          fullname: userResult.fullname,
          email: userResult.email,
          dependents: userResult.dependents,
          logo: userResult._company ? userResult._company.logo : null,
          _company: userResult._company ? userResult._company._id : null,
        };
        return Promise.resolve(response);
      }
      return dbsmart.querySmart(newQuery);
    })
    .then((rows) => {
      if (rows && rows.email) {
        loggedUser = rows;
        loggedUser._company = loggedUser.username === 'admin' ? '1' : loggedUser._company;
        if (loggedUser._company) {
          const userCompany = { logo: loggedUser.logo, _id: loggedUser._company };
          return Promise.resolve(userCompany);
        }
        return Company.findOne(companyQuery);
      } else if (rows.length > 0 && getFieldFromSmartDbResponse(rows[0].SENHA) === reqPassword) {
        loggedUser._id = getFieldFromSmartDbResponse(rows[0].ID);
        loggedUser.name = getFieldFromSmartDbResponse(rows[0].NOME);
        loggedUser.role = getFieldFromSmartDbResponse(rows[0].TIPO);
        return Company.findOne(companyQuery);
      }
      return Promise.reject(new NotAuthorizedError());
    })
    .then((doc) => {
      if (doc && doc._id) {
        loggedUser._company = doc._id;
        loggedUser.logo = doc.logo;
        const genToken = generateToken(loggedUser);
        const response = {
          _id: loggedUser._id,
          token: genToken,
          role: loggedUser.role,
          fullname: loggedUser.name,
          email: loggedUser.email,
          logo: loggedUser.logo,
          _company: loggedUser._company,
        };
        return respondWithData(res, response);
      }
      return Promise.reject(new CompanyNotFoundError());
    })
    .catch(handleError(res));
}

// upsert(put) a specific User
export function putUserUpsert(req, res) {
  const query = { _id: req.swagger.params.id.value };
  const queryOptions = { new: true };
  const updateUser = req.body;

  return User.findOneAndUpdate(query, updateUser, queryOptions)
    .then(respondWithResult(res, 200))
    .catch(handleError(res));
}

// patch a specific User
export function patchUpdateUser(req, res) {
  return User.findById(req.swagger.params.id.value).exec()
    .then(handleEntityNotFound())
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// destroy a specific User
export function deleteUserRemove(req, res) {
  return User.findById(req.swagger.params.id.value).exec()
    .then(handleEntityNotFound())
    .then(entity => entity.remove())
    .then(respondWithDeletedMessage(res))
    .catch(handleError(res));
}
