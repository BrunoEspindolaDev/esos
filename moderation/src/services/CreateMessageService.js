const db = require('@database/knex');

const createMessageService = async ({
  content,
  messageId,
  groupId,
  senderId,
  senderUsername,
  senderBgColor,
  invalidTerms
}) => {
  const [message] = await db('messages')
    .insert({
      content,
      messageId,
      groupId,
      senderId,
      senderUsername,
      senderBgColor,
      invalidTerms
    })
    .returning([
      'id',
      'content',
      'messageId',
      'groupId',
      'senderId',
      'senderUsername',
      'senderBgColor',
      'invalidTerms',
      'createdAt',
      'updatedAt'
    ]);

  return message;
};

module.exports = createMessageService;
