const amqp = require('amqplib');
const { RABBIT_MQ_CONNECTION_URL } = require('@constants');

const publishMessageToModerator = async payload => {
  const connection = await amqp.connect(RABBIT_MQ_CONNECTION_URL);
  const channel = await connection.createChannel();
  const queue = 'chat.to.moderator';

  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
    persistent: true
  });

  setTimeout(() => {
    connection.close();
  }, 500);
};

const publishToLogs = async ({ action, entity, content }) => {
  const connection = await amqp.connect(RABBIT_MQ_CONNECTION_URL);
  const channel = await connection.createChannel();
  const queue = 'chat.to.logs';

  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(
    queue,
    Buffer.from(JSON.stringify({ action, entity, content })),
    {
      persistent: true
    }
  );

  setTimeout(() => {
    connection.close();
  }, 500);
};

module.exports = { publishMessageToModerator, publishToLogs };
