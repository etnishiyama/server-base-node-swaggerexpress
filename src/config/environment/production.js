// Production specific configuration
export default {
  mongo: {
    uri: 'mongodb://localhost/nodeswagger_dev',
  },
  secretKey: 'MoboWebSecretKey',
  defaultDocsRoutingPath: '/api/v1',
  paginateOptions: {
    limit: 20,
  },
};
