const path = require('path');

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5434,
      user: process.env.DB_USER || 'logs',
      password: process.env.DB_PASSWORD || 'logspass',
      database: process.env.DB_NAME || 'logs'
    },
    migrations: {
      directory: path.resolve(__dirname, '../database/migrations')
    }
  }
};
