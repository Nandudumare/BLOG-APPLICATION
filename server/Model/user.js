const { Schema, model } = require("mongoose");



const UserSchema = new Schema({
    name: { type: String, required: true},
    email: { type: String, required: false },
    username: { type: String, required: true },
    password: { type: String, required: false }
})


const UserModel = new model("user", UserSchema)



module.exports = UserModel