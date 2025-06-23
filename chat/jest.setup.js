// Setup environment for tests
require('dotenv').config({ path: './.env.development' });
require('module-alias/register');
// Default to development environment if not set
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
// Provide default RabbitMQ URL for tests
process.env.RABBIT_MQ_CONNECTION_URL =
  process.env.RABBIT_MQ_CONNECTION_URL || 'amqp://localhost';
