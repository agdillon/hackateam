const uuidv4 = require('uuid/v4')

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('events').del()
    .then(function() {
      // Inserts seed entries
      return knex('events').insert([
        {id: 1, key: uuidv4(), name: 'Money2020', date: '2018-10-25', location: 'Las Vegas, Nevada', description: 'Hackathon in Vegas'},
        {id: 2, key: uuidv4(), name: 'HackZurich', date: '2018-11-25', location: 'Europe', description: 'Biggest european hackathon'},
        {id: 3, key: uuidv4(), name: 'TechCrunch Disrupt', date: '2018-12-25',location: 'San Fran, Cali', description: 'Pretty sure this is the one pied piper did'}
      ])
      .then(function() {
        // Moves id column (PK) auto-incrementer to correct value after inserts
        return knex.raw("SELECT setval('events_id_seq', (SELECT MAX(id) FROM events))")
      })
    })
}

