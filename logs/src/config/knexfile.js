const path = require('path');

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5434,
      user: 'logs',
      password: 'logspass',
      database: 'logs'
    },
    migrations: {
      directory: path.resolve(__dirname, '../database/migrations')
    }
  }
};
