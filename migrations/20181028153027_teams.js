exports.up = function(knex, Promise) {
    return knex.schema.createTable('teams', function(table) {
      // TABLE COLUMN DEFINITIONS HERE
      table.increments()
      table.uuid('key').notNullable().unique()
      table.integer('team_size_limit').notNullable().defaultTo(6)
      table.boolean('has_idea', 255).notNullable().defaultTo(false)
      table.boolean('is_full', 255).notNullable().defaultTo(false)
      table.integer('event_id').unsigned()
      table.foreign('event_id').references('id').inTable('events')
      table.text('description').defaultTo('')
      table.timestamps(true, true)
    })
  }
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('teams')
  }
