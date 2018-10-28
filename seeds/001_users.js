const uuidv4 = require('uuid/v4')

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, key: uuidv4(), first_name: 'Christa', last_name: 'Sparks', email: 'example1@gmail.com', portfolio_url: 'bomb.com'},
        {id: 2, key: uuidv4(), first_name: 'Amanda', last_name: 'Dillon', email: 'example2@gmail.com'},
        {id: 3, key: uuidv4(), first_name: 'Tyler', last_name: 'Oreskey', email: 'example3@gmail.com'}
      ])
      .then(function() {
        // Moves id column (PK) auto-incrementer to correct value after inserts
        return knex.raw("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))")
      })
    })
}
