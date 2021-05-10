const passport = require("../config/passport")


module.exports = {
    loginView: (req, res, next) => {
        if (req.session.userId === undefined) {
            req.session.referer = req.get('Referer')
            if (req.session.referer === undefined) {
                req.session.referer = '/'
            }
            if (req.session.badLogin !== undefined) {
                req.flash("error", req.session.badLogin)
            }
            return res.render("auth/login", { title: "Login", header: "HomeVolunteer web site" })
        }
        else {
            res.locals.redirect = "/"
            next()
        }
    },
    authenticate: (req, res, next) => {
        passport.authenticate("local", {
        }, function (err, user, info) {
            if (err) {
                req.flash("error", "Login failed, Please try again!")
                return next(err)
            }
            if (!user) {
                req.flash("error", "Invalid Credentials! Check your username or password!")
                return res.redirect('/auth/login')
            }

            req.logIn(user, function (error) {
                if (error) {
                    req.flash("error", "Login failed!, Please try again!")
                    return next(error)
                }
                req.flash("success", "Logged in!")
                delete req.session.badLogin
                req.session.userId = user.id
                req.session.admin = user.admin
                req.session.userName = user.name
                req.session.email = user.email
                req.session.city = user.city
                req.session.adress = user.adress
                req.session.isPeekToDistribute = user.isPeekToDistribute
                req.session.date = user.date


                // req.session.admin = manager.admin
                // req.session.managerId = manager.id
                // req.session.managerName = manager.name
                req.session.count = 0
                req.session.referer = req.session.referer === "http://localhost:3000/auth/login" ? "http://localhost:3000/" : req.session.referer
                return res.redirect(req.session.referer)
            })
        })(req, res, next)
    },

    logout: (req, res, next) => {
        req.logOut()
        req.session.regenerate(() => {
            req.flash("success", "You have been logged out!")
            res.locals.redirect = "/auth/login"
            next()
        })
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect
        if (redirectPath != undefined) res.redirect(redirectPath)
        else next()
    },
}