const amqp = require('amqplib');
const { RABBIT_MQ_CONNECTION_URL } = require('@constants/index');

const publishCensorToChat = async messageId => {
  const connection = await amqp.connect(RABBIT_MQ_CONNECTION_URL);
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

module.exports = { publishCensorToChat };
