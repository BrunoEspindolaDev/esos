exports.up = function (knex) {
  return knex.schema.createTable('messages', table => {
    table.increments('id').primary();
    table.integer('senderId').notNullable();
    table.string('senderUsername').notNullable();
    table.string('senderBgColor').notNullable();
    table.text('content').notNullable();
    table
      .integer('groupId')
      .unsigned()
      .references('id')
      .inTable('groups')
      .onDelete('CASCADE');
    table.integer('deleted').notNullable().defaultTo(0);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('messages');
};
