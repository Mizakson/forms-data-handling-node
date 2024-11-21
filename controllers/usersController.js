const userStorage = require("../storages/usersStorage")

exports.usersListGet = (req, res) => {
    res.render("index", {
        title: "User list",
        users: userStorage.getUsers(),
    })
}

exports.usersCreateGet = (req, res) => {
    res.render("createUser", {
        title: "Create user",
    })
}

exports.usersCreatePost = (req, res) => {
    const { firstName, lastName } = req.body
    userStorage.addUser({ firstName, lastName })
    res.redirect("/")    
}