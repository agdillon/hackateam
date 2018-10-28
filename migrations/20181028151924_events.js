exports.up = function(knex, Promise) {
    return knex.schema.createTable('events', function(table) {
      // TABLE COLUMN DEFINITIONS HERE
      table.increments()
      table.uuid('key').notNullable().unique()
      table.string('name', 255).notNullable().defaultTo('')
      table.date('date').notNullable().defaultTo(null)
      table.string('location', 255).notNullable().defaultTo('')
    //   table.string('username', 255).notNullable().defaultTo('')
      table.text('description').defaultTo('')
      table.timestamps(true, true)
    })
  }
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('events')
  }
