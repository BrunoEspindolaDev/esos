exports.up = async function (knex) {
  await knex.schema.createTable('groups', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.specificType('users', 'text[]').notNullable().defaultTo('{}');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  });

  await knex('groups').insert({
    name: 'Futebol',
    users: [],
    createdAt: knex.fn.now()
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('groups');
};
