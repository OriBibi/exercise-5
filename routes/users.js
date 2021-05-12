const router = require('express').Router()

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
const { check, validationResult } = require('express-validator')

// const passport = require("../config/passport")

const User = require("../models/user")

const getUserParams = body => {
    return {
        name: body.name,
        admin: body.admin,
        username: body.username,
        password: body.password,
        email: body.email,
        adress: body.adress,
        city: body.city,
        date: body.date,
        isPeekToDistribute: body.isPeekToDistribute
    }
}


const loginView = (req, res, next) => {
    if (req.session.userId === undefined) {
        req.session.referer = req.get('Referer')
        if (req.session.referer === undefined) {
            req.session.referer = '/'
        }
        if (req.session.badLogin !== undefined) {
            req.flash("error", req.session.badLogin)
        }
    }
    else {
        res.locals.redirect = "/"
        next()
    }
}

const index = (req, res, next) => {
    User.find()
        .then(users => {
            res.locals.users = users
            // console.log('22222222',res.locals.users)
            next()
        })
        .catch(error => {
            console.log(`Error fetching user data: ${error.message}`)
            next(error)
        })
}
const listView = (req, res) => {
    return res.json(res.locals.users)
}
const indexView = (req, res) => {

    res.render("users/index", { title: "Users", header: " " })

}

const news = (req, res) => {
    res.render("users/new", { title: "Add User", header: "New user information:" })
}
const distribution = (req, res) => {
    res.render("users/distribution", { title: "Add User", header: "Update daily distribution" })
}
const tableDistribution = (req, res) => {
    res.render("users/tableDistribution", { title: "Add User", header: "daily distribution" })
}
const isAdmin = (req, res, next) => {
    return res.json(User.find().then())
}

const create = (req, res, next) => {
    if (req.skip) return next()
    let userParams = getUserParams(req.body)

    let newUser = new User(userParams)

    User.register(newUser, req.body.password, (error, user) => {
        if (user) {
            req.flash("success", "User account successfully created")
            res.locals.redirect = "/users"
            next()
        }
        else {
            req.flash("error", `Failed to create user account: ${error.message}`)
            res.locals.redirect = "/users/add"
            next()
        }

    })

}

const validate = async (req, res, next) => {
    await check("username", "Username cannot be empty!").notEmpty().run(req)
    await check("password", "Password cannot be empty!").notEmpty().run(req)

    req.body.admin = req.body.admin === undefined ? false : true

    const result = validationResult(req)
    const user = await User.find({ username: req.body.username })
    console.log(`user`, user)
    if (user.length) {
        req.flash("error", "Username already taken ")
        res.locals.redirect = "/users/add"
        req.skip = true
    }
    if (!result.isEmpty()) {
        let messages = result.array().map(e => e.msg)
        req.flash("error", messages.join(" and "))
        req.skip = true
        res.locals.redirect = "/users/add"
    }
    else next()
}

const redirectView = (req, res, next) => {
    let redirectPath = res.locals.redirect
    if (redirectPath != undefined) res.redirect(redirectPath)
    else next()
}
const show = (req, res, next) => {
    User.findOne({ username: req.params.name })
        .then(user => {
            res.locals.user = user
            next()
        })
        .catch(error => {
            console.log(`Error fetching user by ID: ${error.message}`)
            next(error)
        })
}
const showView = (req, res, next) => {
    if (res.locals.user) {
        res.render("users/show", { title: "User info", header: "User Information:" })
    }
    next()
}
const deleting = (req, res, next) => {
    let username = req.params.name
    if (username === 'dzilbers') {
        req.flash("error", "Can not delete THE ADMIN!")
        res.locals.redirect = "/users"
        next()
    }
    else if (username === req.user.username) {
        req.flash("error", "Can not delete yourself")
        res.locals.redirect = "/users"
        next()
    }
    else {
        User.findOneAndDelete({ username })
            .then(() => {
                res.locals.redirect = "/users"
                req.flash("success", `User: ${username} was removed successfully.`)
                next()
            })
            .catch(error => {
                console.log(`Error fetching user by ID: ${error.message}`)
                next(error)
            })
    }
}

router.get("/", checkSession, index, indexView)
router.get("/list", checkSession, index, listView)
router.get("/add", checkSession, checkAdmin, news)
router.get("/distribution", checkSession, checkAdmin, distribution)
router.get("/tableDistribution", checkSession, checkAdmin, tableDistribution)
router.post("/", checkSession, checkAdmin, validate, create, redirectView)
router.get("/:name", checkSession, meOrAdmin, show, showView)
router.delete("/:name", checkSession, checkAdmin, deleting)

module.exports = router
