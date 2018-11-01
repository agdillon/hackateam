
const uuidv4 = require('uuid/v4')

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('teams').del()
    .then(function() {
      // Inserts seed entries
      return knex('teams').insert([
        {id: 1, key: uuidv4(), team_size_limit: 5, has_idea: true, is_full: false, event_id: 3, description: 'Want to create a VR game, I have 4+ years experience in game psychology.'},
        {id: 2, key: uuidv4(), team_size_limit: 6, has_idea: false, is_full: false, event_id: 2, description:'Love working on the backend, down for any idea.'},
        {id: 3, key: uuidv4(), team_size_limit: 4, has_idea: true, is_full: false, event_id: 3, description: 'I want to make an app to find hackathon teams.'},
        {id: 4, key: uuidv4(), team_size_limit: 3, has_idea: false, is_full: false, event_id: 4, description: 'I Love to work in teams and I am good with front end, willing to listen for ideas.'},
        {id: 5, key: uuidv4(), team_size_limit: 5, has_idea: true, is_full: false, event_id: 1, description: 'I want to make an app that tells me how the crypto market is doing.'},
        {id: 6, key: uuidv4(), team_size_limit: 4, has_idea: false, is_full: false, event_id: 4, description: 'I love working with ajax, down for any ideas.'},
        {id: 7, key: uuidv4(), team_size_limit: 3, has_idea: true, is_full: false, event_id: 2, description: 'I want to make an app that gets all the best movies of 2018.'},
        {id: 8, key: uuidv4(), team_size_limit: 4, has_idea: false, is_full: false, event_id: 3, description: 'I am open to any ideas for I do not know what I want to do.'},
        {id: 9, key: uuidv4(), team_size_limit: 6, has_idea: true, is_full: false, event_id: 1, description: 'I want to make an app to find the nearest bar.'},
        {id: 10, key: uuidv4(), team_size_limit: 5, has_idea: false, is_full: false, event_id: 2, description: 'Love working in teams and open to any ideas.'}
      ])
      .then(function() {
        // Moves id column (PK) auto-incrementer to correct value after inserts
        return knex.raw("SELECT setval('teams_id_seq', (SELECT MAX(id) FROM teams))")
      })
    })
}
