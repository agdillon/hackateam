require('dotenv').config()

const passport = require('passport')
const GitHubStrategy = require('passport-github2').Strategy

const cookieSession = require('cookie-session')

const express = require('express')
const cookieParser = require('cookie-parser')
const uuidv4 = require('uuid/v4')
const cors = require('cors')
const knex = require('./knex')

const port = process.env.PORT || 3000

const app = express()

const usersRouter = require('./routes/users')
const teamsRouter = require('./routes/teams')
const eventsRouter = require('./routes/events')
const skillsRouter = require('./routes/skills')

app.use(cors())
app.use(cookieParser())

app.use(cookieSession({ secret: process.env.COOKIE_SECRET, httpOnly: false }))

// passport middleware
app.use(passport.initialize())

passport.serializeUser((user, done) => {
  console.log("serialize user", user.id)
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  // what do i need to do when user visits the site and already has a cookie?
  // i.e. what needs to be stored in req.user?
  knex('users').first().where('id', id)
    .then(user => {
      console.log("deserialize user", user)
      done(null, user)
    })
    .catch(err => next(err))
})

passport.use(new GitHubStrategy(
  {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK,
    userAgent: process.env.DOMAIN,
    scope: 'user:email'
  },
  function onSuccess(token, refreshToken, profile, done) {
    // split name from GitHub to prepopulate first and last name
    let firstName, lastName
    let fullName = profile.displayName
    let firstSpaceIndex = fullName.indexOf(' ')
    if (firstSpaceIndex === -1) {
      firstName = fullName
    }
    else {
      firstName = fullName.slice(0, firstSpaceIndex)
      lastName = fullName.slice(firstSpaceIndex + 1)
    }

    console.log("passport callback function")

    knex('users').first().where('email', profile.emails[0].value)
      .then(user => {
        // check db to see if user already exists (by email)
        console.log("user retrieved from knex in callback", user)
        if (user) {
          done(null, user)
        }
        // if not, make a db entry for them
        else {
          knex('users').insert({ key: uuidv4(), email: profile.emails[0].value,
            first_name: firstName, last_name: lastName, user_picture_url: profile._json.avatar_url })
            .returning('*')
            .then(user => {
              console.log("user added to knex in callback", user)
              done(null, user[0])
            })
            .catch(err => next(err))
        }
      })
      .catch(err => next(err))
  }
))

app.use(passport.session())

app.use(express.json())
app.use(cookieParser())

app.use(express.static('public'))

// passport route to initiate GitHub OAuth
app.get('/users/auth/github', passport.authenticate('github'))

// passport callback route
app.get('/users/auth',
  passport.authenticate('github', {
    successRedirect: 'https://hackateam-cat.herokuapp.com/html/user-profile.html',
    failureRedirect: 'https://hackateam-cat.herokuapp.com/',
    scope: 'user:email'
  }), (req, res) => {
    console.log("req.user", req.user)
  }
)

// routers
app.use('/users', usersRouter)
app.use('/teams', teamsRouter)
app.use('/events', eventsRouter)
app.use('/skills', skillsRouter)

// error handler
app.use((err, req, res, next) => {
  err.status = err.status || 500
  err.message = err.message || 'Internal server error'

  res.json(err)
})

// 404
app.use((req, res, next) => {
  res.json({ status: 404, message: 'Not found'})
})

app.listen(port, () => { console.log(`Listening on port ${port}`) })
