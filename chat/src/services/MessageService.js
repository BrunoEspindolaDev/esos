const db = require('@database/knex');

const createMessage = async ({
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

const updateMessage = async (id, content) => {
  const [message] = await db('messages')
    .where({ id })
    .update({ content, updatedAt: db.fn.now() })
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

const deleteMessage = async id => {
  const [message] = await db('messages')
    .where({ id })
    .returning([
      'id',
      'senderId',
      'senderUsername',
      'senderBgColor',
      'content',
      'createdAt'
    ]);

  if (!message) return null;

  await db('messages').where({ id }).del();

  return message;
};

module.exports = {
  createMessage,
  updateMessage,
  deleteMessage
};
