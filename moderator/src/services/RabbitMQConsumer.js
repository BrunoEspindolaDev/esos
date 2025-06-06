const amqp = require('amqplib');
const { isEmpty } = require('lodash');
const terms = require('@constants/terms');
const { analyzeText } = require('@utils/functions');
const { RABBIT_MQ_CONNECTION_URL } = require('@constants');
const MessageService = require('@services/MessageService');
const RabbitMQPublisher = require('@services/RabbitMQPublisher');

const listenChat = async () => {
  const connection = await amqp.connect(RABBIT_MQ_CONNECTION_URL);
  const channel = await connection.createChannel();
  const queue = 'chat.to.moderator';

  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async msg => {
    if (msg !== null) {
      const { action, message } = JSON.parse(msg.content.toString());

      if (action === 'DELETE') {
        await MessageService.deleteMessage(message.id);
      } else {
        const invalidTerms = analyzeText(message.content, terms);

        if (!isEmpty(invalidTerms)) {
          const isExist = await MessageService.findMessageById(message.id);
          const data = { ...message, invalidTerms };

          await MessageService.createMessage(data);
          await RabbitMQPublisher.publishCensorToChat(message.id);
        }
      }

      channel.ack(msg);
    }
  });
};

module.exports = { listenChat };
