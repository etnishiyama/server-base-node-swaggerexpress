// Development specific configuration
export default {
  mongo: {
    uri: 'mongodb://localhost/nodeswagger_dev',
  },
  secretKey: 'MoboWebSecretKey',
  defaultDocsRoutingPath: '/api/v1dev',
  paginateOptions: {
    limit: 20,
  },
};
