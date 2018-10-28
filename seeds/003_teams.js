
const uuidv4 = require('uuid/v4')

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('teams').del()
    .then(function() {
      // Inserts seed entries
      return knex('teams').insert([
        {id: 1, key: uuidv4(), team_size_limit: 5, has_idea: true, is_full: true, event_id: 3, description: 'Want to create a VR game, I have 4+ years experience in game psychology.'},
        {id: 2, key: uuidv4(), team_size_limit: 6, has_idea: false, is_full: false, event_id: 2, description:'Love working on the backend, down for any idea.'},
        {id: 3, key: uuidv4(), team_size_limit: 4, has_idea: true, is_full: false, event_id: 1, description: 'I want to make an app to find hackathon teams.'}
      ])
      .then(function() {
        // Moves id column (PK) auto-incrementer to correct value after inserts
        return knex.raw("SELECT setval('teams_id_seq', (SELECT MAX(id) FROM teams))")
      })
    })
}
