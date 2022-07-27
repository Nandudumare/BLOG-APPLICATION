
const { Router } = require("express");
const CommentModel = require("../Model/comment");
const comment = Router();

comment.get("/:id", async (req, res) => {
    try {
        const commentdata = await CommentModel.find({ blog_id: req.params.id});
        return res.send(commentdata)

    } catch (err) {
        return res.status(400).send("Something went wrong")
    }
})


comment.post("/", async (req, res) => {
    try {
        const newComment = new CommentModel({
            ...req.body
        })

        await newComment.save()

        return res.send(newComment)
    } catch (err) {
        return res.status(400).send("Something went wrong")
    }
})



module.exports = comment