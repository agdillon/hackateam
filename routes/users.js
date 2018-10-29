const express = require('express')
const uuidv4 = require('uuid/v4')
const knex = require('../knex')

const router = express.Router()

// after successful OAuth login
router.get('/login', (req, res, next) => {
  // split name from GitHub to prepopulate first and last name
  let firstName, lastName
  let fullName = req.user.displayName
  let firstSpaceIndex = fullName.indexOf(' ')
  if (firstSpaceIndex === -1) {
    firstName = fullName
  }
  else {
    firstName = fullName.slice(0, firstSpaceIndex)
    lastName = fullName.slice(firstSpaceIndex + 1)
  }

  // check db to see if user already exists (by email in req.user)
  knex('users').first().where('email', req.user.email)
    .then(user => {
      // if so, redirect to dashboard
      if (user) {
        res.send(user)
        // res.redirect('/dashboard.html')
      }
      // if not, make a db entry for them, redirect to create profile page
      else {
        knex('users').insert({ key: uuidv4(), email: req.user.email,
          first_name: firstName, last_name: lastName, user_picture_url: req.user.user_picture_url })
          .then(() => {
            res.redirect('/user-profile.html')
          })
      }
    })
})

// user edit (update)
router.put('/users/:id', (req, res, next) => {
  // // check authorization -- should also check secret and check if cookie session id is the same as req.params.id
  // if (!req.cookies || req.cookies.expire < new Date()) {
  //   next({ status: 401, message: "Not authorized" })
  // }

  let { first_name, last_name, email, portfolio_url } = req.body
  knex('users').update({ first_name, last_name, email, portfolio_url }).where('id', req.params.id)
    .then(() => {
      res.redirect('/dashboard.html')
    })
})

// user delete
router.delete('/users/:id', (req, res, next) => {
  // // check authorization -- should also check secret and check if cookie session id is the same as req.params.id
  // if (!req.cookies || req.cookies.expire < new Date()) {
  //   next({ status: 401, message: "Not authorized" })
  // }

  knex('users').del().where('id', req.params.id)
    .then(() => {
      res.clearCookie('hackateam')
      res.redirect('/welcome.html')
    })
})

module.exports = router
