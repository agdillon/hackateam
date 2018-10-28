exports.up = function(knex, Promise) {
    return knex.schema.createTable('user_skills', function(table) {
      // TABLE COLUMN DEFINITIONS HERE
      table.increments()
      table.uuid('key').notNullable().unique()
      table.integer('user_id').unsigned()
      table.integer('skill_id').unsigned()
      table.foreign('user_id').references('id').inTable('users')
      table.foreign('skill_id').references('id').inTable('skills')
      table.timestamps(true, true)
      table.unique(['user_id', 'skill_id'])
    })
  }
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('user_skills')
  }