const router = require('express').Router()

const homeController = require('../controllers/HomeController')
const checkSession = require("../middleware/check-session")


router.get("/", checkSession, homeController.index)

module.exports = router
