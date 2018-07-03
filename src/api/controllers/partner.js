import Partner from '../../api/models/partner';
import patchUpdates from '../utils/mongoHelper';
import {
  handleEntityNotFound,
  handleError,
  respondWithDeletedMessage,
  respondWithResult,
} from '../utils/requestHelpers';
import awsHelper from '../utils/awsHelper';
import constants from '../utils/constants';

// Gets a list of Partners
export function getPartnerList(req, res) {
  const query = { _company: req.auth._company };
  const queryOptions = { page: req.swagger.params.page.value || 1 };
  return Partner.paginate(query, queryOptions)
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a specific Partner by id
export function getPartnerById(req, res) {
  return Partner.findById(req.swagger.params.id.value).exec()
    .then(handleEntityNotFound())
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a Partner
export function postPartnerCreate(req, res) {
  const newPartner = req.body;
  newPartner._company = req.auth._company;
  return awsHelper.uploadImageToS3Bucket(constants.PATH_PARTNER_LOGO, newPartner.logo)
    .then((url) => {
      newPartner.logo = url;
      return Partner.create(req.body);
    })
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// upsert(put) a specific Partner
export function putPartnerUpsert(req, res) {
  const updatePartner = req.body;
  const query = { _id: req.swagger.params.id.value };
  const queryOptions = { new: true };

  return new Promise((resolve) => {
    if (updatePartner.logo.length > 100) {
      return resolve(awsHelper.uploadImageToS3Bucket(
        constants.PATH_PARTNER_LOGO,
        updatePartner.logo,
      ));
    }
    return resolve(updatePartner.logo);
  })
    .then((url) => {
      updatePartner.logo = url;
      return Partner.findOneAndUpdate(query, updatePartner, queryOptions);
    })
    .then(respondWithResult(res, 200))
    .catch(handleError(res));
}

// patch a specific Partner
export function patchPartnerUpdate(req, res) {
  return Partner.findById(req.swagger.params.id.value).exec()
    .then(handleEntityNotFound())
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// destroy a specific Partner
export function deletePartnerRemove(req, res) {
  return Partner.findById(req.swagger.params.id.value).exec()
    .then(handleEntityNotFound())
    .then(entity => entity.remove())
    .then(respondWithDeletedMessage(res))
    .catch(handleError(res));
}
