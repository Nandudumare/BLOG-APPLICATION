const { Schema, model, SchemaTypes } = require("mongoose");


const BlogSchema = new Schema({
    user_id: SchemaTypes.ObjectId,
    category:[SchemaTypes.ObjectId],//[ids]
    Title: String,
    Body: String,
    CreatedAt: Date,
    UpdatedAt: Date,
    Deleted : Boolean,
})

const Blog = new model("blog", BlogSchema)

module.exports = Blog