const { Schema, model } = require("mongoose");



const CommentSchema = new Schema({
    blog_id: String,
    user_id: String,
    message: String,
    rating: Number,
});

const CommentModel = new model("comment", CommentSchema)


module.exports = CommentModel