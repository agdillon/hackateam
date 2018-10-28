exports.up = function(knex, Promise) {
    return knex.schema.createTable('skills', function(table) {
      // TABLE COLUMN DEFINITIONS HERE
      table.increments()
      table.uuid('key').notNullable().unique()
      table.string('type').notNullable().unique()
      table.timestamps(true, true)
    })
  }
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('skills')
  }
