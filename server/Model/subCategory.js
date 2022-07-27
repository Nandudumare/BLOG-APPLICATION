const { Schema, model ,SchemaTypes} = require('mongoose');


const SubCategorySchema = new Schema({
    name: String,
    ancestore: [String],
    parent_id:SchemaTypes.ObjectId,
})


const SubCategoryModel = new model("subcategory", SubCategorySchema)


module.exports = SubCategoryModel