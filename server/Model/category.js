const { Schema, model, SchemaTypes } = require("mongoose");



const CategorySchema = new Schema({
    name: String,
    parent_id:SchemaTypes.ObjectId || null,
})

const CategoryModel = new model("category", CategorySchema)


module.exports = CategoryModel