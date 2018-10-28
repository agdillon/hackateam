exports.up = function(knex, Promise) {
    return knex.schema.createTable('skills_team_wanted', function(table) {
      // TABLE COLUMN DEFINITIONS HERE
      table.increments()
      table.uuid('key').notNullable().unique()
      table.integer('skill_id').unsigned()
      table.integer('team_id').unsigned()
      table.foreign('skill_id').references('id').inTable('skills')
      table.foreign('team_id').references('id').inTable('teams')
      table.timestamps(true, true)
      table.unique(['skill_id', 'team_id'])
    })
  }
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('skills_team_wanted')
  }
