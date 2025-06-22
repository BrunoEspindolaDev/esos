exports.up = async function (knex) {
  await knex.schema.createTable('logs', table => {
    table.increments('id').primary();
    table.integer('userId').notNullable();
    table.string('entity').notNullable();
    table.integer('entityId').notNullable();
    table.string('action').notNullable();
    table.integer('deleted').defaultTo(0);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('logs');
};
