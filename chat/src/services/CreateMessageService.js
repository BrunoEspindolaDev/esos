const db = require('@database/knex');

const createMessageService = async ({
  content,
  senderId,
  senderUsername,
  senderBgColor
}) => {
  const [message] = await db('messages')
    .insert({ content, senderId, senderUsername, senderBgColor })
    .returning([
      'id',
      'senderId',
      'senderUsername',
      'senderBgColor',
      'content',
      'createdAt'
    ]);

  return message;
};

module.exports = createMessageService;
