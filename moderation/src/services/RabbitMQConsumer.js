const amqp = require('amqplib');
const terms = require('@constants/terms');
const { analyzeText } = require('@utils/functions');
const RabbitMQPublisher = require('@services/RabbitMQPublisher');
const MessageService = require('@services/MessageService');

const listenChat = async () => {
  const connection = await amqp.connect('amqp://user:password@localhost');
  const channel = await connection.createChannel();
  const queue = 'chat.to.moderator';

  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async msg => {
    if (msg !== null) {
      const message = JSON.parse(msg.content.toString());
      const invalidTerms = analyzeText(message.content, terms);

      if (invalidTerms.length > 0) {
        const isExist = await MessageService.findMessageById(message.id);
        const data = { ...message, invalidTerms };

        if (isExist) {
          await MessageService.updateMessage(data);
        } else {
          await MessageService.createMessage(data);
        }

        await RabbitMQPublisher.publishCensorToChat(message.id);
      }

      channel.ack(msg);
    }
  });
};

module.exports = { listenChat };
