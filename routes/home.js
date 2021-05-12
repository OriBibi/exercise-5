const router = require('express').Router()

const checkSession = require("../middleware/check-session")

 const   index=  (req, res) => {
        req.session.count++
        res.render("homePage/index.html", { title: "Home", header: "" })
    }

router.get("/", checkSession, index)

module.exports = router
