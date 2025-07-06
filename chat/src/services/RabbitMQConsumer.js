const amqp = require('amqplib');
const CensorService = require('@services/CensorService');
const { RABBIT_MQ_CONNECTION_URL } = require('@constants/index');

const listenCensorships = async () => {
  const connection = await amqp.connect(RABBIT_MQ_CONNECTION_URL);
  const channel = await connection.createChannel();
  const queue = 'moderator.to.chat';

  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async msg => {
    if (msg !== null) {
      const { messageId } = JSON.parse(msg.content.toString());

      await CensorService.censorMessage(
        messageId,
        'Esta mensagem foi censurada.'
      );

      channel.ack(msg);
    }
  });
};

module.exports = { listenCensorships };
