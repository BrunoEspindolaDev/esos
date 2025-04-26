const path = require('path');

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5433,
      user: 'moderation',
      password: 'moderationpass',
      database: 'moderation'
    },
    migrations: {
      directory: path.resolve(__dirname, '../database/migrations')
    }
  }
};
