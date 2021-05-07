module.exports = {
    index: (req, res) => {
        req.session.count++
        res.render("homePage/index.html", { title: "Home", header: "" })
    }
}