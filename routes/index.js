const router = require('express').Router()

const indexRouter = require('./home')
const usersRouter = require('./users')
const authRouter = require('./auth')
router.use("/", indexRouter)
router.use("/auth", authRouter)
router.use("/users", usersRouter)

module.exports = router