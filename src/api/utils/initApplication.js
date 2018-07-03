import User from '../models/user';
import constants from '../utils/constants';

function createUserAdmin() {
  const newUser = new User({
    name: 'Application',
    lastname: 'Administrator',
    fullname: 'Application Administrator',
    email: 'admin@admin.com',
    username: 'admin',
    password: 'admin',
    role: constants.ROLE_ADMIN,
  });

  newUser
    .save()
    .catch((err) => {
      console.log(err.message);
    });
}

function createDefaultUser() {
  const newUser = new User({
    name: 'Usuário',
    lastname: 'Padrão',
    fullname: 'Usuário Padrão',
    email: 'user@user.com',
    username: 'user',
    password: 'user',
    role: constants.ROLE_USER,
  });

  newUser
    .save()
    .catch((err) => {
      console.log(err.message);
    });
}

function init() {
  createUserAdmin();
  createDefaultUser();
}

export default {
  init,
};
