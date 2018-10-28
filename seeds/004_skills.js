const uuidv4 = require('uuid/v4')

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('skills').del()
    .then(function() {
      // Inserts seed entries
      return knex('skills').insert([
        {id: 1, key: uuidv4(), type: 'javascript'},
        {id: 2, key: uuidv4(), type: 'Node.js'},
        {id: 3, key: uuidv4(), type: 'c++'},
        {id: 4, key: uuidv4(), type: 'frontend'},
        {id: 5, key: uuidv4(), type: 'backend'},
        {id: 6, key: uuidv4(), type: 'python'},
        {id: 7, key: uuidv4(), type: 'html'},
        {id: 8, key: uuidv4(), type: 'css'},
        {id: 9, key: uuidv4(), type: 'sql'},
        {id: 10, key: uuidv4(), type: 'oauth'}
      ])
      .then(function() {
        // Moves id column (PK) auto-incrementer to correct value after inserts
        return knex.raw("SELECT setval('skills_id_seq', (SELECT MAX(id) FROM skills))")
      })
    })
}
