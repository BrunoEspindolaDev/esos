const path = require('path');

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5432,
      user: 'admin',
      password: 'adminpass',
      database: 'chat'
    },
    migrations: {
      directory: path.resolve(__dirname, '../database/migrations')
    }
  }
};
