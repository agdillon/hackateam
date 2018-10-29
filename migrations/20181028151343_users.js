exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function(table) {
      // TABLE COLUMN DEFINITIONS HERE
      table.increments()
      table.uuid('key').notNullable().unique()
      table.string('first_name', 255).notNullable().defaultTo('')
      table.string('last_name', 255).notNullable().defaultTo('')
      table.string('email', 255).notNullable().defaultTo('').unique()
      table.text('portfolio_url').defaultTo('')
      table.text('user_picture_url').defaultTo('')
      table.timestamps(true, true)
    })
  }
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users')
  }