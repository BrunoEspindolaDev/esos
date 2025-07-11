const path = require('path');

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5433,
      user: process.env.DB_USER || 'moderation',
      password: process.env.DB_PASSWORD || 'moderationpass',
      database: process.env.DB_NAME || 'moderation'
    },
    migrations: {
      directory: path.resolve(__dirname, '../database/migrations')
    }
  }
};
