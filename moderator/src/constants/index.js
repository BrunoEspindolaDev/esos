const RABBIT_MQ_CONNECTION_URL =
  process.env.RABBITMQ_URL || `amqp://user:password@localhost`;

module.exports = { RABBIT_MQ_CONNECTION_URL };
