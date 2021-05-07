module.exports = (req, res, next) => {
    if (req.session.admin === undefined || req.session.admin === false) {
        req.flash("error", "You need to be an Admin to modify data")
        return res.redirect('/users')
    }
    else
        next()
};