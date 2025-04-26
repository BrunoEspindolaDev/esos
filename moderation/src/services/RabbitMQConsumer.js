const amqp = require('amqplib');
const NotifyChatService = require('@services/NotifyChatService');
const CreateMessageService = require('@services/CreateMessageService');
const { analyzeText } = require('@utils/functions');
const terms = require('@constants/terms');

const listenForMessages = async () => {
  const connection = await amqp.connect('amqp://user:password@localhost');
  const channel = await connection.createChannel();
  const queue = 'chat.to.moderator';

  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async msg => {
    if (msg !== null) {
      const message = JSON.parse(msg.content.toString());

      const invalidTerms = analyzeText(message.content, terms);

      if (invalidTerms.length > 0) {
        await CreateMessageService({ ...message, invalidTerms });
        await NotifyChatService(message.messageId);
      }

      channel.ack(msg);
    }
  });
};

module.exports = { listenForMessages };
