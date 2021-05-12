const { Db } = require('mongodb');
const mongoose = require('mongoose');
const { use } = require('passport');


require('dotenv').config()

console.log(process.env.MONGO_URI)


mongoose.connect(process.env.MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        auth: {
            user: process.env.MONGO_USER,
            password: process.env.MONGO_PASS
        }
    }).
    catch(error => console.log(error))
mongoose.connection.on("connected", () => { console.log("Mongoose Connected to MongoDB.") })
mongoose.connection.on('error', err => {
    console.log(err)
})


module.exports = mongoose

