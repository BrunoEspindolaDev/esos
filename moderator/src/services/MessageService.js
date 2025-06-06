const db = require('@database/knex');

const findMessageById = async messageId => {
  return await db('messages').where({ messageId }).first();
};

const createMessage = async ({
  content,
  id: messageId,
  groupId = 1,
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

const updateMessage = async ({
  content,
  id: messageId,
  groupId = 1,
  senderId,
  senderUsername,
  senderBgColor,
  invalidTerms
}) => {
  const [message] = await db('messages')
    .where({ messageId })
    .update({
      content,
      groupId,
      senderId,
      senderUsername,
      senderBgColor,
      invalidTerms,
      updatedAt: db.fn.now()
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

module.exports = {
  createMessage,
  updateMessage,
  findMessageById
};
