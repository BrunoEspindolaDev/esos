const db = require('@database/knex');

const addUserService = async ({ userId, groupId }) => {
  await db('groups')
    .where({ id: groupId })
    .update({
      users: db.raw('array_append(users, ?)', [userId])
    });

  const updatedGroup = await db('groups').where({ id: groupId }).first();

  return updatedGroup;
};

module.exports = addUserService;
