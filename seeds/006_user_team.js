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
        {id: 4, key: uuidv4(), user_id: 2, team_id: 1},
        {id: 5, key: uuidv4(), user_id: 3, team_id: 2},
        {id: 6, key: uuidv4(), user_id: 3, team_id: 8},
        {id: 7, key: uuidv4(), user_id: 4, team_id: 10},
        {id: 8, key: uuidv4(), user_id: 4, team_id: 4},
        {id: 9, key: uuidv4(), user_id: 5, team_id: 5},
        {id: 10, key: uuidv4(), user_id: 5, team_id: 4},
        {id: 11, key: uuidv4(), user_id: 6, team_id: 9},
        {id: 12, key: uuidv4(), user_id: 6, team_id: 5},
        {id: 13, key: uuidv4(), user_id: 7, team_id: 6},
        {id: 14, key: uuidv4(), user_id: 7, team_id: 3},
        {id: 15, key: uuidv4(), user_id: 8, team_id: 6},
        {id: 16, key: uuidv4(), user_id: 8, team_id: 7},
        {id: 17, key: uuidv4(), user_id: 9, team_id: 8},
        {id: 18, key: uuidv4(), user_id: 9, team_id: 9},
        {id: 19, key: uuidv4(), user_id: 10, team_id: 7},
        {id: 20, key: uuidv4(), user_id: 10, team_id: 10}
      ])
      .then(function() {
        // Moves id column (PK) auto-incrementer to correct value after inserts
        return knex.raw("SELECT setval('user_team_id_seq', (SELECT MAX(id) FROM user_team))")
      })
    })
}
