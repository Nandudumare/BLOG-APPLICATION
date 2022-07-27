const { Router } = require("express");
const Blog = require("../Model/blog");
const CategoryModel = require("../Model/category");
const SubCategoryModel = require("../Model/subCategory");
const jwt = require("jsonwebtoken");
const blog = Router();

//BlogList
blog.get("/", async (req, res) => {
  console.log(req.session.token);
  try {
    const token = req.headers["authorization"]?.split(" ")[1] || "";
    if (token.length > 0) {
      const decoded = jwt.verify(token, "SECRET15432!");
      if (decoded) {
        const blogsData = await Blog.find({ Deleted: false });

        return res.status(200).send(blogsData);
      }
    }
  } catch (err) {
    return res.status(400).send("Something went Wrong");
  }
});

//random blogs
blog.get("/random", async (req, res) => {
  try {
    let data = await Blog.aggregate([{ $sample: { size: 10 } }]);
    return res.send(data);
  } catch (err) {
    return res.sendStatus(404);
  }
});

//Entity Page // desciption page
blog.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const Singleblog = await Blog.find({ _id: id });
    return res.status(200).send(Singleblog);
  } catch (err) {
    return res.status(400).send("Something went Wrong");
  }
});

//particular users blog
blog.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const token = req.headers["authorization"]?.split(" ")[1] || "";
    if (token.length > 0) {
      const decoded = jwt.verify(token, "SECRET15432!");
      if (decoded) {
        const userBlogs = await Blog.find({ user_id: id, Deleted: false });
        return res.status(200).send(userBlogs);
      }
    }
  } catch (err) {
    return res.status(400).send("Something went Wrong");
  }
});

//Deleted List
blog.get("/trash/user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const token = req.headers["authorization"]?.split(" ")[1] || "";
    if (token.length > 0) {
      const decoded = jwt.verify(token, "SECRET15432!");
      if (decoded) {
        const deletedData = await Blog.find({ user_id: id, Deleted: true });
        return res.status(200).send(deletedData);
      }
    }
  } catch (err) {
    return res.status(400).send("Something went Wrong");
  }
});

//Create
blog.post("/", async (req, res) => {
  try {
    const { category } = req.body; //["books","movie"]

    const categoryData = await SubCategoryModel.find(
      { name: { $in: [...category] } },
      { name: 0, ancestore: 0, parent_id: 0, __v: 0 }
    );

    const newCatId = categoryData.map((el) => el._id);

    const newblog = new Blog({
      ...req.body,
      category: newCatId,
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
      Deleted: false,
    });
    await newblog.save();

    return res.send(req.body);
  } catch (err) {
    return res.status(400).send("Something went Wrong");
  }
});

blog.post("/filterd", async (req, res) => {
  try {
    const { category, user_id } = req.body;

    const filterd = await Blog.find({
      category: { $in: [...category] },
      user_id: user_id,
      Deleted: false,
    });

    return res.send(filterd);
  } catch (err) {
    return res.status(400).send("Something went Wrong");
  }
});

//Edit
blog.patch("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { category } = req.body; //["books","movie"]

    const categoryData = await SubCategoryModel.find(
      { name: { $in: [...category] } },
      { name: 0, ancestore: 0, parent_id: 0, __v: 0 }
    );

    const newCatId = categoryData.map((el) => el._id);
    // const blog = await Blog.findeOne({ _id: id });
    // const cat = blog[0].category

    const updated = await Blog.updateOne(
      { _id: id },
      { $set: { ...req.body, category: [...newCatId], UpdatedAt: new Date() } }
    );

    return res.status(200).send(req.body);
  } catch (err) {
    return res.status(400).send("Something went Wrong");
  }
});

//Restore
blog.patch("/restore/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedDelete = await Blog.updateOne(
      { _id: id },
      { $set: { ...req.body, Deleted: false } }
    );
    return res.status(200).send("restored");
    // const deleted = await Blog.deleteOne({ _id:id })
    // if (deleted.deletedCount === 0) {
    //     return res.json("Invalid id")
    // } else {
    //     return res.json({})
    // }
  } catch (err) {
    return res.status(400).send("Something went Wrong");
  }
});

//Deleted permanently
blog.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // const updatedDelete = await Blog.updateOne({ _id: id }, { $set: { ...req.body, UpdatedAt: new Date(), Deleted: true } });
    // return res.status(200).send({})
    const deleted = await Blog.deleteOne({ _id: id });
    if (deleted.deletedCount === 0) {
      return res.json("Invalid id");
    } else {
      return res.json({});
    }
  } catch (err) {
    return res.status(400).send("Something went Wrong");
  }
});

//make Deleted key true
blog.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedDelete = await Blog.updateOne(
      { _id: id },
      { $set: { ...req.body, UpdatedAt: new Date(), Deleted: true } }
    );
    return res.status(200).send({});
    // const deleted = await Blog.deleteOne({ _id:id })
    // if (deleted.deletedCount === 0) {
    //     return res.json("Invalid id")
    // } else {
    //     return res.json({})
    // }
  } catch (err) {
    return res.status(400).send("Something went Wrong");
  }
});

module.exports = blog;
