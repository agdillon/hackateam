require('dotenv').config()

const passport = require('passport')
const GitHubStrategy = require('passport-github2').Strategy

const cookieSession = require('cookie-session')

const express = require('express')
const cookieParser = require('cookie-parser')

const cors = require('cors')

const port = process.env.PORT || 3000
const cookieAge = 24 * 60 * 60 * 1000 // 24 hours

const app = express()

const usersRouter = require('./routes/users')
const teamsRouter = require('./routes/teams')
const eventsRouter = require('./routes/events')
const skillsRouter = require('./routes/skills')

app.use(cors())

app.use(cookieSession({ secret: process.env.COOKIE_SECRET, maxAge: cookieAge }))

// passport middleware
app.use(passport.initialize())

passport.use(new GitHubStrategy(
  {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK,
    userAgent: process.env.DOMAIN,
    scope: 'user:email'
  },
  function onSuccess(token, refreshToken, profile, done) {
    console.log("*** onSuccess, token: ", token);
    console.log("*** onSuccess, profile.displayName: ", profile.displayName);
    // serialize token and profile
    done(null, { token, profile })
  }
))

// session/cookie stuff
app.use(passport.session())

passport.serializeUser((object, done) => {
  console.log(object)
  console.log("*** passport.serializeUser callback, object.profile.displayName: ", object.profile.displayName);
  done(null, { displayName: object.profile.displayName, token: object.token,
    email: object.profile.emails[0].value, user_picture_url: object.profile._json.avatar_url })
})

passport.deserializeUser((object, done) => {
  console.log("*** passport.deserializeUser, object: ", object);
  done(null, object)
})

app.use(express.json())
app.use(cookieParser())

app.get('/users/auth',
  passport.authenticate('github', {
    successRedirect: '/users/login',
    failureRedirect: '/welcome.html',
    scope: 'user:email'
  }))

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
