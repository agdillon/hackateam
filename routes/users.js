require('dotenv').config()

const passport = require('passport')
const GitHubStrategy = require('passport-github').Strategy

const cookieSession = require('cookie-session')

const express = require('express')
const uuidv4 = require('uuid/v4')
const knex = require('../knex')

const cookieAge = 24 * 60 * 60 * 1000 // 24 hours

const router = express.Router()

router.use(cookieSession({ name: 'hackateam', secret: process.env.COOKIE_SECRET, maxAge: cookieAge }))

router.use(passport.initialize())

passport.use(new GitHubStrategy(
  {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK,
    userAgent: process.env.DOMAIN
  },
  function onSuccess(token, refreshToken, profile, done) {
    console.log("*** onSuccess, token: ", token);
    console.log("*** onSuccess, profile.displayName: ", profile.displayName);
    // serialize token and profile
    done(null, { token, profile })
  }
))

router.use(passport.session())

passport.serializeUser((object, done) => {
  console.log("*** passport.serializeUser callback, object.profile.displayName: ", object.profile.displayName);
  done(null, { displayName: object.profile.displayName, token: object.token })
})

passport.deserializeUser((object, done) => {
  console.log("*** passport.deserializeUser, object: ", object);
  done(null, object)
})

router.get('/auth',
  passport.authenticate('github', {
    successRedirect: '/users/login',
    failureRedirect: '/welcome.html',
    scope: 'user:email'
  }))

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
