import jwt from 'jsonwebtoken';
import { notAuthorized } from './requestHelpers';
import config from '../../config/environment';

const { secretKey } = config;

export function tokenVerifier(req, authOrSecDef, scopesOrApiKey, callback) {
  let fail = true;
  const token = req.headers.authorization;
  const currentScopes = req.swagger.operation['x-security-scopes'];
  // validate the 'Authorization' header. it should have the following format: Bearer tokenString
  if (token && token.indexOf('Bearer ') === 0) {
    const tokenString = token.split(' ')[1];
    jwt.verify(tokenString, secretKey, (error, decodedToken) => {
      // check if the JWT was verified correctly
      if (!error) {
        // check if the role is valid for this endpoint
        const roleMatch = currentScopes.indexOf(decodedToken.role) !== -1;

        if (roleMatch) {
          req.auth = decodedToken;
          fail = false;
        }
      }
    });
  }

  if (fail) {
    return notAuthorized(req.res);
  }

  return callback(null);
}

export function generateToken(user) {
  const sharedSecret = secretKey;

  const payload = {
    _id: user._id,
    role: user.role,
    _company: user._company ? user._company._id || user._company : null,
  };

  const token = jwt.sign(
    payload,
    sharedSecret,
    { expiresIn: '999 days' },
  );

  return token;
}
