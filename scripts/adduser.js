const mongoose = require("../config/mongoose")
const passport = require("../config/passport")

const controller = require('../controllers/usersController')
const User = require("../models/user")

const timeout = require("./timeout")
const prompt = require('./promt')

passport.initialize();

(async () => {
    console.clear()
    await timeout(500)
    while (true) {
        let input = []
        console.log()
        input[0] = await prompt("Please enter user's name: ")
        input[1] = await prompt('Please enter username: ')
        input[2] = await prompt('Please enter password: ')
        let admin = await prompt('Please enter admin status (Y or anything other): ')
        input[3] = admin == 'Y' || admin == 'y'
        input[4] = await prompt("Please enter your email: ")
        console.log(input)
        try {
            let newUser = {
                name: input[0],
                admin: input[3],
                username: input[1],
                password: input[2],
                email:input[4]
            }
            console.log(`newUser`, newUser)
            await User.register(newUser, newUser.password, (error, user) => {
                if (user) {
                    console.log('User created:' + user)
                }
                else {
                    throw error
                }
            })
            // await User.CREATE(user)
        } catch (error) {
            throw error
        }
    }
})()
