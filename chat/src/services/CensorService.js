const db = require('@database/knex');

const censorMessage = async (messageId, newContent) => {
  await db('messages').where({ id: messageId }).update({ content: newContent });
};

module.exports = { censorMessage };
