const { Router } = require("express");
const SubCategoryModel = require("../Model/subCategory");

const subCat = Router();

subCat.get("/", async function (req, res) {
  try {
    const subCategory = await SubCategoryModel.find();
    return res.send(subCategory);
  } catch (err) {
    return res.status(400).send("Something went wrong");
  }
});

subCat.post("/arrayid", async (req, res) => {
  const { categoryDataString } = req.body;
  try {
    const categoryData = await SubCategoryModel.find(
      { name: { $in: [...categoryDataString] } },
      { name: 0, __v: 0 }
    );

    const newCatId = categoryData.map((el) => el._id);

    return res.send(newCatId);
  } catch (err) {
    return res.status(400).send("Something Went Wrong");
  }
});

subCat.post("/", async function (req, res) {
  try {
    const newSub = await SubCategoryModel.insertMany(req.body.data);

    return res.send("data saved");
  } catch (err) {
    return res.status(400).send("Something went wrong");
  }
});

module.exports = subCat;
