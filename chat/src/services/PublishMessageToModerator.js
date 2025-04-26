const amqp = require('amqplib');

const publishMessageToModerator = async message => {
  const connection = await amqp.connect('amqp://user:password@localhost');
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

module.exports = publishMessageToModerator;
