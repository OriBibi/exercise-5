const { Db } = require('mongodb');
const mongoose = require('mongoose');
const { use } = require('passport');


require('dotenv').config()

console.log(process.env.MONGO_DB_URI)


mongoose.connect(process.env.MONGO_DB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        auth: {
            user: process.env.MONGO_DB_USER,
            password: process.env.MONGO_DB_PASS
        }
    }).
    catch(error => console.log(error))
mongoose.connection.on("connected", () => { console.log("Mongoose Connected to MongoDB.") })
mongoose.connection.on('error', err => {
    console.log(err)
})


module.exports = mongoose

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://OriBibi:OriBibi123456789@cluster0.mkyfp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("Volunteers").collection("Distributors");
//   // perform actions on the collection object
//   client.close();
// });

// console.log(client.isConnected(MongoClient.isConnected));
// console.log("111111111111111111111111111111111111111")