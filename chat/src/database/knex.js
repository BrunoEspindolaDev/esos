const knex = require('knex');
const config = require('@config/knexfile');

const env = process.env.NODE_ENV || 'development';
// Use development config as fallback for unknown environments (e.g., test)
const envConfig = config[env] || config['development'];
const db = knex(envConfig);

module.exports = db;
