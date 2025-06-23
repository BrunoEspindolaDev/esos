const path = require('path');
require('dotenv').config({
  path: path.resolve(
    __dirname,
    '../../.env.' + (process.env.NODE_ENV || 'development')
  )
});

const RABBIT_MQ_CONNECTION_URL = process.env.RABBIT_MQ_CONNECTION_URL;

module.exports = { RABBIT_MQ_CONNECTION_URL };
