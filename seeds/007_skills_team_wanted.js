const uuidv4 = require('uuid/v4')

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('skills_team_wanted').del()
    .then(function() {
      // Inserts seed entries
      return knex('skills_team_wanted').insert([
        {id: 1, key: uuidv4(), team_id: 1, skill_id: 1},
        {id: 2, key: uuidv4(), team_id: 1, skill_id: 10},
        {id: 3, key: uuidv4(), team_id: 2, skill_id: 3},
        {id: 4, key: uuidv4(), team_id: 3, skill_id: 5},
        {id: 5, key: uuidv4(), team_id: 3, skill_id: 6},
        {id: 6, key: uuidv4(), team_id: 3, skill_id: 3}
      ])
      .then(function() {
        // Moves id column (PK) auto-incrementer to correct value after inserts
        return knex.raw("SELECT setval('skills_team_wanted_id_seq', (SELECT MAX(id) FROM skills_team_wanted))")
      })
    })
}

