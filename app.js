const createError = require('http-errors')
const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const expressLayouts = require("express-ejs-layouts")
const expressSession = require("express-session")
const connectFlash = require("connect-flash")

// configured services import
const passport = require("./config/passport")
require("./config/mongoose")

// import routes
const routes = require("./routes")
const { db } = require('./models/user')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile);
app.set("layout extractScripts", true)

// middleware setup
app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')))
app.use(expressLayouts)
// @ts-ignore
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET || "my_cookie_secret"))
app.use(expressSession({
  secret: process.env.SESSION_SECRET || 'my_session_secret',
  cookie: {
    maxAge: 360000
  },
  resave: false,
  saveUninitialized: false
}))
app.use(connectFlash())
// passport init
app.use(passport.initialize())
app.use(passport.session())


// add variables for ejs engine
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash()
  res.locals.loggedIn = req.isAuthenticated()
  res.locals.currentUser = req.user
  res.locals.admin = req.session.admin
  res.locals.email = req.session.email
  res.locals.isPeekToDistribute = req.session.isPeekToDistribute
  res.locals.date = req.session.date
  res.locals.city = req.session.city
  res.locals.adress = req.session.adress
  res.locals.managerId = req.session.userId
  res.locals.userName = req.session.userName
  res.locals.count = req.session.count
  res.locals.path = req.path
  console.log('1111111111111',res.locals.admin)

  next()
})

// routes
app.use(routes)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError("404"))
})



// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.errorMessage = err.status === 404 ? "Oops! Something went wrong. The page you're looking for does not exist" : "Sorry! Something went wrong with our application :("
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.locals.env = req.app.get('env')
  // render the error page
  res.status(err.status || 500)
  res.render('error', { title: "error", header: res.locals.errorMessage })
})

module.exports = app
