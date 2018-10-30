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
  // // check authorization -- should also check secret and check if cookie session id is the same as req.params.id
  // if (!req.cookies || req.cookies.expire < new Date()) {
  //   next({ status: 401, message: "Not authorized" })
  // }

  let { first_name, last_name, portfolio_url } = req.body
  knex('users').update({ first_name, last_name, portfolio_url }).where('id', req.params.id)
    .then(() => {
      res.redirect('/dashboard.html')
    })
    .catch((err) => { console.log(err) })
})

// user delete
router.delete('/:id', (req, res, next) => {
  // // check authorization -- should also check secret and check if cookie session id is the same as req.params.id
  // if (!req.cookies || req.cookies.expire < new Date()) {
  //   next({ status: 401, message: "Not authorized" })
  // }

  knex('users').del().where('id', req.params.id)
    .then(() => {
      res.clearCookie('hackateam')
      res.redirect('/welcome.html')
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

module.exports = router
