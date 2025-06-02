const amqp = require('amqplib');

const CONNECTION_URL = `amqp://user:password@localhost`;

const publishMessageToModerator = async message => {
  const connection = await amqp.connect(CONNECTION_URL);
  const channel = await connection.createChannel();
  const queue = 'chat.to.moderator';

  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true
  });

  setTimeout(() => {
    connection.close();
  }, 500);
};

const publishToLogs = async ({ action, entity, content }) => {
  const connection = await amqp.connect(CONNECTION_URL);
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
