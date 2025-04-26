const amqp = require('amqplib');

const notifyChatService = async messageId => {
  const connection = await amqp.connect('amqp://user:password@localhost');
  const channel = await connection.createChannel();
  const queue = 'moderator.to.chat';

  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify({ messageId })), {
    persistent: true
  });

  setTimeout(() => {
    connection.close();
  }, 500);
};

module.exports = notifyChatService;
