import dotenv from 'dotenv';
import _ from 'lodash';
import mongoosePaginate from 'mongoose-paginate';
import dev from './development';
import prod from './production';
import constants from '../../api/utils/constants';

dotenv.config();

let env = dev;
if (process.env.NODE_ENV === constants.ENV_PRODUCTION) {
  env = prod;
}

const all = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  ip: process.env.IP || 'localhost',
  seedDB: false,
  mongo: {
    options: {
      useMongoClient: true,
    },
  },
};

mongoosePaginate.paginate.options = env.paginateOptions;

export default _.merge(
  all,
  env || {},
);
