const db = require('@database/knex');

const censorMessageService = async (messageId, newContent) => {
  await db('messages').where({ id: messageId }).update({ content: newContent });
};

module.exports = censorMessageService;
