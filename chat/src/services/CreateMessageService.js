const db = require('@database/knex');

const createMessageService = async ({ senderId, senderUsername, content }) => {
  const [message] = await db('messages')
    .insert({ senderId, senderUsername, content })
    .returning(['id', 'senderId', 'senderUsername', 'content', 'createdAt']);

  return message;
};

module.exports = createMessageService;
