const uuidv4 = require('uuid/v4')

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('user_team').del()
    .then(function() {
      // Inserts seed entries
      return knex('user_team').insert([
        {id: 1, key: uuidv4(), user_id: 1, team_id: 1},
        {id: 2, key: uuidv4(), user_id: 1, team_id: 2},
        {id: 3, key: uuidv4(), user_id: 2, team_id: 3},
        {id: 4, key: uuidv4(), user_id: 3, team_id: 1},
        {id: 5, key: uuidv4(), user_id: 3, team_id: 2},
        {id: 6, key: uuidv4(), user_id: 3, team_id: 3}
      ])
      .then(function() {
        // Moves id column (PK) auto-incrementer to correct value after inserts
        return knex.raw("SELECT setval('user_team_id_seq', (SELECT MAX(id) FROM user_team))")
      })
    })
}
