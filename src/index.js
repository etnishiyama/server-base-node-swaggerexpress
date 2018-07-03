import server, { init } from './app';
import logger from './api/utils/logger';
import constants from './api/utils/constants';

// Set default node environment to development
const env = process.env.NODE_ENV || constants.ENV_DEVELOPMENT;

logger.info(`Environment is set to: ${env}`);
if (env === 'prod') {
  process.env.NODE_CONFIG_DIR = 'dist/config';
} else {
  process.env.NODE_CONFIG_DIR = 'src/config';
}

init();

export default server;
