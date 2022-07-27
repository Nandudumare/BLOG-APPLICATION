const { Router } = require("express");
const CategoryModel = require("../Model/category");

const category = Router();

category.get("/", async (req, res) => {
  try {
    const categoryData = await CategoryModel.aggregate([
      {
        $lookup: {
          from: "subcategories",
          localField: "_id",
          foreignField: "parent_id",
          as: "subcat",
        },
      },
    ]);
    return res.send(categoryData);
  } catch (err) {
    return res.send("Something went wrong");
  }
});

category.post("/", async (req, res) => {
  try {
    const newCategory = await CategoryModel.insertMany(req.body.data);

    return res.send("data saved");
  } catch (err) {
    return res.status(400).send("Something Went Wrong");
  }
});

module.exports = category;
