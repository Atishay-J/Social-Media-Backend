const express = require("express");
const Posts = require("../Models/postSchema");
const verifyToken = require("../Middleware/verifyToken");
const ImageKit = require("imagekit");

const router = new express.Router();

var imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
});

router.get("/uploadimage", (req, res) => {
  try {
    let token = req.headers.authorization;
    let authenticationParameters = imagekit.getAuthenticationParameters(token);
    console.log(authenticationParameters);
    res.send(authenticationParameters);
  } catch (err) {
    console.log("Some Error Occured", err);
  }
});

router.post("/createpost", verifyToken, async (req, res) => {
  try {
    let authenticated = res.locals.authenticated;

    const { username, postContent, avatar, postImg } = req.body;

    if (postContent || postImg) {
      return await new Posts({ username, postContent, avatar, postImg })
        .save()
        .then((response) => {
          res.status(201).json(response);
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    }
    res.status(400).send("Some Error Occured");
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
    if (username) {
      const alreadyLiked = post.likes.find((user) => user === username);

      if (alreadyLiked) {
        post.likes = post.likes.filter((user) => user !== username);
      } else {
        post.likes.push(username);
      }

      return post
        .save()
        .then((response) => res.status(200).json(response))
        .catch((err) => res.status(500).send(err));
    }
    res.status(400).send("Some Error Occured");
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
