const debug = require("debug")("mongo:model-user");
const mongo = require("mongoose");

// on every save, add the date
/* schema.pre('save', function(next) {
    // get the current date
    let currentDate = new Date();
    // change the updated_at field to current date
    this.updated_at = currentDate;
    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;
    next();
}); */



module.exports = db => {
    let schema = new mongo.Schema({
        name: String,
        username: { type: String, required: true, unique: true, index: true },
        password: { type: String, required: true },
        admin: Boolean,
        location: String,
        email:String,
        phone:String,
        created_at: Date,
        updated_at: Date
    }, { autoIndex: false });

          

    db.model('User', schema); // if model name === collection name
    debug("User model created");

    schema.statics.CREATE = async function(user) {
        return this.create({
            name: user[0],
            username: user[1],
            password: user[2],
            admin: user[3],
            location: user[4],
            email: user[5],
            phone: user[6]
        });
    }
}
    

    