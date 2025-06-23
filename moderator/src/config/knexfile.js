const path = require('path');
require('dotenv').config({
  path: path.resolve(
    __dirname,
    '../../.env.' + (process.env.NODE_ENV || 'development')
  )
});

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    migrations: {
      directory: path.resolve(__dirname, '../database/migrations')
    }
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    migrations: {
      directory: path.resolve(__dirname, '../database/migrations')
    }
  }
};
