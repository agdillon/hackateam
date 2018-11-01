const uuidv4 = require('uuid/v4')

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function() {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, key: uuidv4(), first_name: 'Christa', last_name: 'Sparks', email: 'example1@gmail.com', portfolio_url: 'bomb.com'},
        {id: 2, key: uuidv4(), first_name: 'Amanda', last_name: 'Dillon', email: 'example2@gmail.com'},
        {id: 3, key: uuidv4(), first_name: 'Nick', last_name: 'Griffen', email: 'example3@gmail.com'},
        {id: 4, key: uuidv4(), first_name: 'Tim', last_name: 'Watervoort', email: 'example4@gmail.com'},
        {id: 5, key: uuidv4(), first_name: 'Tim', last_name: 'Remington', email: 'example5@gmail.com'},
        {id: 6, key: uuidv4(), first_name: 'Nick', last_name: 'Tzavarez', email: 'example6@gmail.com'},
        {id: 7, key: uuidv4(), first_name: 'Pete', last_name: 'Silva', email: 'example7@gmail.com'},
        {id: 8, key: uuidv4(), first_name: 'Craig', last_name: 'Quincy', email: 'example8@gmail.com'},
        {id: 9, key: uuidv4(), first_name: 'Eric', last_name: 'Scheetz', email: 'example9@gmail.com'},
        {id: 10, key: uuidv4(), first_name: 'Riley', last_name: 'Burns', email: 'example10@gmail.com'}
      ])
      .then(function() {
        // Moves id column (PK) auto-incrementer to correct value after inserts
        return knex.raw("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))")
      })
    })
}
