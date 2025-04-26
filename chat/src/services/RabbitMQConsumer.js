const amqp = require('amqplib');
const CensorMessageService = require('@services/CensorMessageService');

const listenForCensorships = async () => {
  const connection = await amqp.connect('amqp://user:password@localhost');
  const channel = await connection.createChannel();
  const queue = 'moderator.to.chat';

  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async msg => {
    if (msg !== null) {
      const { messageId } = JSON.parse(msg.content.toString());

      console.log({ messageId });

      await CensorMessageService(messageId, 'Esta mensagem foi censurada.');

      channel.ack(msg);
    }
  });
};

module.exports = { listenForCensorships };
