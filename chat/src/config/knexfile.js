const path = require('path');

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'chat',
      password: process.env.DB_PASSWORD || 'chatpass',
      database: process.env.DB_NAME || 'chat'
    },
    migrations: {
      directory: path.resolve(__dirname, '../database/migrations')
    }
  }
};
