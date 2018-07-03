import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import mongoosePaginate from 'mongoose-paginate';
import constants from '../utils/constants';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  lastname: {
    type: String,
  },
  fullname: {
    type: String,
  },
  email: {
    type: String,
  },
  category: {
    type: String,
  },
  position: {
    type: String,
  },
  workplace: {
    type: String,
  },
  dependents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: constants.ROLES,
    default: constants.ROLE_DEFAULT,
  },
}, {
  timestamps: true,
});

userSchema.plugin(mongoosePaginate);

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compareSync(password, this.password);
};

function generateHashPassword(user, next) {
  const newUser = user;

  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) {
      return next(saltError);
    }

    return bcrypt.hash(user.password, salt, (hashError, hash) => {
      if (hashError) {
        return next(hashError);
      }
      newUser.password = hash;
      return next();
    });
  });
}

userSchema.pre('save', function save(next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  return generateHashPassword(user, next);
});

userSchema.pre('findOneAndUpdate', function preSave(next) {
  const user = this.getUpdate();
  if (user.password.length > 20) {
    next();
  }

  return generateHashPassword(user, next);
});

export default mongoose.model('User', userSchema);
