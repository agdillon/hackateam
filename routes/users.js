const express = require('express')
const knex = require('../knex')

const router = express.Router()

// user log out
router.get('/logout', (req, res, next) => {
  req.logout()
  res.redirect('https://hackateam-cat.herokuapp.com/')
})

// get one user by id
router.get('/:id', (req, res, next) => {
  knex('users').first().where('id', req.params.id)
    .then(user => {
      res.json(user)
    })
    .catch((err) => { console.log(err) })
})

// user edit (update)
router.put('/:id', (req, res, next) => {
  let { first_name, last_name, portfolio_url } = req.body
  knex('users').update({ first_name, last_name, portfolio_url }).where('id', req.params.id)
    .then(() => {
      res.redirect('https://hackateam-cat.herokuapp.com/html/dashboard.html')
    })
    .catch((err) => { console.log(err) })
})

// user delete - not using this route
router.delete('/:id', (req, res, next) => {
  knex('users').del().where('id', req.params.id)
    .then(() => {
      res.clearCookie('hackateam')
      res.redirect('https://hackateam-cat.herokuapp.com/')
    })
    .catch((err) => { console.log(err) })
})

// get all skills for user
router.get('/:id/skills', (req, res, next) => {
  knex('users').select('skills.id', 'skills.key', 'skills.type')
  .innerJoin('user_skills', 'users.id', 'user_id')
  .innerJoin('skills', 'skills.id', 'skill_id')
  .where('users.id', req.params.id)
    .then(rows => {
      res.json(rows)
    })
    .catch((err) => { console.log(err) })
})

// get all teams for user
router.get('/:id/teams', (req, res, next) => {
  knex('users').select('teams.id', 'teams.key', 'team_size_limit',
  'teams.has_idea', 'teams.is_full', 'teams.event_id', 'teams.description')
  .innerJoin('user_team', 'users.id', 'user_id')
  .innerJoin('teams', 'teams.id', 'team_id')
  .where('users.id', req.params.id)
    .then(rows => {
      res.json(rows)
    })
    .catch((err) => { console.log(err) })
})

module.exports = router
