const Actions = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE'
};

const Entities = {
  MESSAGE: 'MESSAGE'
};

const RABBIT_MQ_CONNECTION_URL = `amqp://user:password@localhost`;

module.exports = { Actions, Entities, RABBIT_MQ_CONNECTION_URL };
