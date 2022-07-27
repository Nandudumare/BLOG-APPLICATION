const { Router } = require('express');
const LikeModel = require('../Model/like')

const likes = Router();


likes.get('/',async function (req, res) {
    try {
        const likedData = await LikeModel.find({ blog_id: req.query.q });
        return res.send(likedData)
    } catch (err) {
        return res.status(400).send("Something went wrong");
    }
})

likes.post('/', async function (req, res) {
    try {
       
        const likedData = await LikeModel.find({ ...req.body });
        
        if (likedData.length === 0 ) {
            const newLike = new LikeModel({ ...req.body });
            await newLike.save();
            return res.send(newLike);
        } else  {
            return res.send("Already Liked")
        } 
    } catch (err) {
        return res.status(400).send("Something went wrong");
    }
})

likes.delete('/:id', async function (req, res) {
    try {
        const dl = await LikeModel.deleteOne({ user_id: req.params.id });
        return res.send({})
    } catch (err) {
        return res.status(400).send("Something went wrong");
    }
})


module.exports = likes