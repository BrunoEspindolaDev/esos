const db = require('@database/knex');

const createLogService = async ({ userId, entity, entityId, action }) => {
  const [message] = await db('logs')
    .insert({ userId, entity, entityId, action })
    .returning(['userId', 'entity', 'entityId', 'action']);

  return message;
};

module.exports = { createLogService };
