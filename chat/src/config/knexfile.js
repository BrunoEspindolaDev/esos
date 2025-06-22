const path = require('path');

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5432,
      user: 'chat',
      password: 'chatpass',
      database: 'chat'
    },
    migrations: {
      directory: path.resolve(__dirname, '../database/migrations')
    }
  }
};
