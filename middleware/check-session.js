module.exports = (req, res, next) => {
    if (req.session === undefined || req.session.userId === undefined || !req.isAuthenticated)
        res.redirect('/auth/login')
    else
        next()
};