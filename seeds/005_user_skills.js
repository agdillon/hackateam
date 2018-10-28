const uuidv4 = require('uuid/v4')

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('user_skills').del()
    .then(function() {
      // Inserts seed entries
      return knex('user_skills').insert([
        {id: 1, key: uuidv4(), user_id: 1, skill_id: 1},
        {id: 2, key: uuidv4(), user_id: 1, skill_id: 2},
        {id: 3, key: uuidv4(), user_id: 1, skill_id: 3},
        {id: 4, key: uuidv4(), user_id: 2, skill_id: 1},
        {id: 5, key: uuidv4(), user_id: 2, skill_id: 9},
        {id: 6, key: uuidv4(), user_id: 2, skill_id: 7},
        {id: 7, key: uuidv4(), user_id: 3, skill_id: 2},
        {id: 8, key: uuidv4(), user_id: 3, skill_id: 7},
        {id: 9, key: uuidv4(), user_id: 3, skill_id: 6},
        {id: 10, key: uuidv4(), user_id: 3, skill_id: 10}
      ])
      .then(function() {
        // Moves id column (PK) auto-incrementer to correct value after inserts
        return knex.raw("SELECT setval('user_skills_id_seq', (SELECT MAX(id) FROM user_skills))")
      })
    })
}
