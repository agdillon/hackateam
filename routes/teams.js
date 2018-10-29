const express = require('express')
const router = express.Router()
const knex = require('../knex')
const uuidv4 = require('uuid/v4')
// READ ALL records for this table

router.get('/', (req, res, next) => {
    // if time pass on skills_wanted for a filter or filter in the route
    knex('teams')
      .then((rows) => {
        res.json(rows)
      })
      .catch((err) => {
        next(err)
      })
  })
// READ ONE record for this table
// Get team info and all associated users
router.get('/:id', (req, res, next) => {
    knex('user_team')
    .select('user_team.user_id', 'user_team.team_id', 'users.first_name', 'users.last_name', 'users.email', 'users.portfolio_url')
    .join('users', 'user_team.user_id', 'users.id')
    .where('user_team.team_id', req.params.id)
    .then((userData) => {
        knex('teams')
        .select('id', 'team_size_limit', 'has_idea', 'is_full', 'event_id', 'description')
        .where('id',req.params.id)
        .then((teamData) => {
            res.json({
                teamData: teamData,
                userData: userData
            })
        })
        .catch((err) => {
            next(err)
        })
    })
    .catch((err) => {
        next(err)
    })
  })
// CREATE ONE record for this table
router.post('/', (req, res, next) => {
    knex('teams')
      .insert({
        "key": uuidv4(),
        "team_size_limit": req.body.team_size_limit,
        "event_id": req.body.event_id,
        "has_idea": req.body.idea,
        "is_full": req.body.is_full,
        "description": req.body.description
      })
      .returning('*')
      .then((data) => {
        res.json(data[0])
      })
      .catch((err) => {
        next(err)
      })
  })
// UPDATE ONE record for this table
router.put('/:id', (req, res, next) => {
    knex('teams')
    .where('id', req.params.id)
    .then((data) => {
      knex('teams')
      .where('id', req.params.id)
      .limit(1)
      .update({
        "team_size_limit": req.body.team_size_limit,
        "event_id": req.body.event_id,
        "has_idea": req.body.idea,
        "is_full": req.body.is_full,
        "description": req.body.description
      })
      .returning('*')
      .then((data) => {
        res.json(data[0])
      })
    })
    .catch((err) => {
      next(err)
    })
  })
// DELETE ONE record for this table
router.delete('/:id', function(req, res, next) {
    knex('teams')
      .where('id', req.params.id)
      .first()
      .then((row) => {
        if(!row) return next()
        knex('teams')
          .del()
          .where('id', req.params.id)
          .then(() => {
            res.send(`ID ${req.params.id} Deleted`)
          })
      })
      .catch((err) => {
        next(err)
      })
  }) 
module.exports = router