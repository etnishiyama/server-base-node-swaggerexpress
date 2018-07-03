import bodyParser from 'body-parser';
import SwaggerUi from 'swagger-tools/middleware/swagger-ui';
import SwaggerExpress from 'swagger-express-mw';
import app from 'express';
import config from './config/environment';
import logger from './api/utils/logger';
import db from './config/db';
import { tokenVerifier } from './api/utils/auth';
import initApplication from './api/utils/initApplication';

const server = app();
const { defaultDocsRoutingPath } = config;

export const init = () => {
  const routingDocsPath = process.env.ROUTING_PATH || defaultDocsRoutingPath;
  initApplication.init();
  db.connectToMongo();

  const appConfig = {
    appRoot: __dirname, // swagger required config
    swaggerSecurityHandlers: {
      apiKey: tokenVerifier,
    },
  };

  SwaggerExpress.create(appConfig, (err, swaggerExpress) => {
    if (err) throw err;
    server.use(bodyParser.json({ limit: '10mb' }));
    server.use(routingDocsPath, SwaggerUi(swaggerExpress.runner.swagger));
    swaggerExpress.register(server);
    logger.info(`Server running on localhost:${config.port}`);
    server.listen(config.port);
  });
};

export default server; // just for testing
