exports.up = function(knex, Promise) {
    return knex.schema.createTable('user_team', function(table) {
      // TABLE COLUMN DEFINITIONS HERE
      table.increments()
      table.uuid('key').notNullable().unique()
      table.integer('user_id').unsigned()
      table.integer('team_id').unsigned()
      table.foreign('user_id').references('id').inTable('users')
      table.foreign('team_id').references('id').inTable('teams')
      table.timestamps(true, true)
      table.unique(['user_id', 'team_id'])
    })
  }
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('user_team')
  }
