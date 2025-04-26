const db = require('@database/knex');

const createMessageService = async ({
  content,
  groupId,
  senderId,
  senderUsername,
  senderBgColor,
  invalidTerms
}) => {
  const [message] = await db('messages')
    .insert({
      content,
      groupId,
      senderId,
      senderUsername,
      senderBgColor,
      invalidTerms
    })
    .returning([
      'id',
      'content',
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
