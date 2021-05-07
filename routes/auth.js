const router = require('express').Router()

const authController = require("../controllers/authController")


router.get("/login", authController.loginView, authController.redirectView)
router.post("/login", authController.authenticate)
router.get("/logout", authController.logout, authController.redirectView)

module.exports = router