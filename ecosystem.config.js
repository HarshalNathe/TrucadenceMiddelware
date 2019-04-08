module.exports = {
  /**
   * Application specific configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'Trucadence',
      script: 'server.js',
      env: {
        NODE_ENV: 'development',
        PORT: 443,
        NODE_CONFIG_DIR: 'config/'
      }
    }
  ]
};
