exports.up = function (knex) {
  return knex.schema.createTable('messages', table => {
    table.increments('id').primary();
    table.integer('messageId').notNullable();
    table.text('content').notNullable();
    table.integer('groupId').notNullable();
    table.integer('senderId').notNullable();
    table.string('senderUsername').notNullable();
    table.string('senderBgColor').notNullable();
    table.specificType('invalidTerms', 'text[]');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('messages');
};
