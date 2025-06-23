const amqp = require('amqplib');
const Log = require('@models/Log');
const LogService = require('@services/LogService');
const { RABBIT_MQ_CONNECTION_URL } = require('@constants'); // Now loaded from env in constants file

const listenChat = async () => {
  const connection = await amqp.connect(RABBIT_MQ_CONNECTION_URL);
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

      await LogService.createLogService(log);
      channel.ack(msg);
    }
  });
};

module.exports = { listenChat };
