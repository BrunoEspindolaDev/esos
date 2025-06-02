const amqp = require('amqplib');
const Log = require('@models/Log');
const CreateLogService = require('@services/CreateLogService');

const listenChat = async () => {
  const connection = await amqp.connect('amqp://user:password@localhost');
  const channel = await connection.createChannel();
  const queue = 'chat.to.logs';

  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async msg => {
    if (msg !== null) {
      const {
        action,
        entity,
        content: { id, senderId }
      } = JSON.parse(msg.content.toString());

      const log = Log.createLog({
        userId: senderId,
        entity,
        entityId: id,
        action
      });

      await CreateLogService(log);
      channel.ack(msg);
    }
  });
};

module.exports = { listenChat };
