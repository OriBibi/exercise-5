const passportLocalMongoose = require("passport-local-mongoose")

const mongoose = require("mongoose")

const { Schema } = require("mongoose")
const userSchema = new Schema(
    {
        name: String,
        username: { type: String, required: true, unique: true, index: true },
        password: { type: String, required: true },
        admin: Boolean,
        email: String,
        location: String,
        meta: {
            age: Number,
            website: String
        },
    },
    {
        timestamps: true,
        autoIndex: false
    }
)

userSchema.virtual("fullName").get(function () {
    return `${this.name.first} ${this.name.last}`
})

userSchema.plugin(passportLocalMongoose, {
    usernameField: "username"
})

module.exports = mongoose.model("User", userSchema)
