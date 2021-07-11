const express = require("express");
const Posts = require("../Models/postSchema");
const verifyToken = require("../Middleware/verifyToken");

const router = new express.Router();

router.post("/createpost", verifyToken, async (req, res) => {
  try {
    let authenticated = res.locals.authenticated;

    console.log("\n \n \n Autheticated \n \n \n ", authenticated);

    const { username, postContent, avatar } = req.body;
    console.log("REquerst Body", username);
    const newPost = new Posts({ username, postContent, avatar })
      .save()
      .then((response) => {
        return res.status(201).json(response);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/allposts", verifyToken, async (req, res) => {
  try {
    const allPosts = await Posts.find({});
    res.status(200).json(allPosts);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/post/togglelike", verifyToken, async (req, res) => {
  try {
    const { username, postId } = req.body;

    const post = await Posts.findById(postId);
    const alreadyLiked = post.likes.find((user) => user === username);

    if (alreadyLiked) {
      post.likes = post.likes.filter((user) => user !== username);
    } else {
      post.likes.push(username);
    }

    post
      .save()
      .then((response) => res.status(200).json(response))
      .catch((err) => res.status(500).send(err));
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
