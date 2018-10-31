const uuidv4 = require('uuid/v4')

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('events').del()
    .then(function() {
      // Inserts seed entries
      return knex('events').insert([
        {id: 1, key: uuidv4(), name: 'Money2020', date: '2018-11-12', location: 'Las Vegas, Nevada', description: 'Hackathon in Vegas', event_picture_url: 'https://pbs.twimg.com/profile_images/915954899925467136/MQFzXfTQ_400x400.jpg', website: 'https://www.money2020.com/'},
        {id: 2, key: uuidv4(), name: 'HackZurich', date: '2018-11-25', location: 'Europe', description: 'Biggest european hackathon', event_picture_url: 'https://digitalfestival.ch/assets/img/head.hack.png', website: 'https://digitalfestival.ch/en/HACK/'},
        {id: 3, key: uuidv4(), name: 'TechCrunch Disrupt', date: '2018-12-25',location: 'San Fran, Cali', description: 'Pretty sure this is the one pied piper did', event_picture_url: 'https://techcrunch.com/wp-content/themes/techcrunch-2017/images/opengraph-default.png', website: 'https://techcrunch.com/events/disrupt-sf-2018/'},
        {id: 4, key: uuidv4(), name: 'ShellHacks', date: '2019-1-25',location: 'Miami, FL', description: 'welcome to miami', event_picture_url: 'https://www.4geeksacademy.co/wp-content/uploads/2018/05/shell-hacks-e1527044176211.png', website: 'https://shellhacks.net/'}
      ])
      .then(function() {
        // Moves id column (PK) auto-incrementer to correct value after inserts
        return knex.raw("SELECT setval('events_id_seq', (SELECT MAX(id) FROM events))")
      })
    })
}

