import * as logger from 'winston';

logger.configure({
  transports: [
    new logger.transports.File({ name: 'debuglog', filename: 'debug.log' }),
    new logger.transports.File({ name: 'errorlog', filename: 'debug_error.log', level: 'error' }),
    new logger.transports.Console({ timestamp: true }),
  ],
});

export default logger;
