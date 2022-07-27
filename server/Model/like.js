const { Schema, model } = require("mongoose");



const LikeSchema = new Schema({
    blog_id: String,
    user_id: String,
    emoji:String
})

const LikeModel = new model("like", LikeSchema)


module.exports = LikeModel