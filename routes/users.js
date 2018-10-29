const express = require('express')
const uuidv4 = require('uuid/v4')
const knex = require('../knex')

const router = express.Router()

// after successful OAuth login
router.get('/login', (req, res, next) => {
  // check db to see if user already exists (by email in req.user)
  // I don't actually know what req.user looks like, req.user.email might not be right
  knex('users').first().where('email', req.user.email)
    .then(user => {
      // if so, redirect to dashboard
      if (user) {
        res.redirect('/dashboard.html')
      }
      // if not, make a db entry for them, redirect to create profile page
      else {
        knex('users').insert({ key: uuidv4(), email: req.user.email })
          .then(() => {
            res.redirect('/user-profile.html')
          })
      }
    })
})

// user edit (update)
router.put('/users/:id', (req, res, next) => {
  // check authorization -- should also check secret and check if cookie session id is the same as req.params.id
  if (!req.cookies || req.cookies.expire < new Date()) {
    next({ status: 401, message: "Not authorized" })
  }

  let { first_name, last_name, email, portfolio_url } = req.body
  knex('users').update({ first_name, last_name, email, portfolio_url }).where('id', req.params.id)
    .then(() => {
      res.redirect('/dashboard.html')
    })
})

// user delete
router.delete('/users/:id', (req, res, next) => {
  // check authorization -- should also check secret and check if cookie session id is the same as req.params.id
  if (!req.cookies || req.cookies.expire < new Date()) {
    next({ status: 401, message: "Not authorized" })
  }

  knex('users').del().where('id', req.params.id)
    .then(() => {
      res.clearCookie('hackateam')
      res.redirect('/welcome.html')
    })
})

module.exports = router
