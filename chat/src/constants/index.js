const path = require('path');
require('dotenv').config({
  path: path.resolve(
    __dirname,
    '../../.env.' + (process.env.NODE_ENV || 'development')
  )
});

const Actions = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE'
};

const Entities = {
  MESSAGE: 'MESSAGE'
};

const RABBIT_MQ_CONNECTION_URL = process.env.RABBIT_MQ_CONNECTION_URL;

module.exports = { Actions, Entities, RABBIT_MQ_CONNECTION_URL };
