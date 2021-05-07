const router = require('express').Router()

const usersController = require("../controllers/usersController")
const checkSession = require("../middleware/check-session")
const checkAdmin = require("../middleware/check-admin")

const meOrAdmin = (req, res, next) => {
    if (res.locals.currentUser.username === req.params.name) {
        next()
    }
    else {
        checkAdmin(req, res, next)
    }
}

router.get("/", checkSession, usersController.index, usersController.indexView)
router.get("/list", checkSession, usersController.index, usersController.listView)
router.get("/add", checkSession, checkAdmin, usersController.new)
router.get("/distribution", checkSession, checkAdmin, usersController.distribution)
router.get("/tableDistribution", checkSession, checkAdmin, usersController.tableDistribution)
router.post("/", checkSession, checkAdmin, usersController.validate, usersController.create, usersController.redirectView)
router.get("/:name", checkSession, meOrAdmin, usersController.show, usersController.showView)
router.delete("/:name", checkSession, checkAdmin, usersController.delete)

module.exports = router
