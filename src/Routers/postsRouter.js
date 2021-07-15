const express = require("express");
const Posts = require("../Models/postSchema");
const Users = require("../Models/userSchema");
const verifyToken = require("../Middleware/verifyToken");
const ImageKit = require("imagekit");
const createNewNotification = require("../Utils/notificationGenerator");

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

    const {
      userId,
      username,
      postContent,
      avatar,
      postImg,
      firstname,
      lastname,
    } = req.body;

    console.log("\n \n Usre ID of create Post \n ", userId);

    if (postContent || postImg) {
      return await new Posts({
        userId,
        username,
        postContent,
        avatar,
        postImg,
        firstname,
        lastname,
      })
        .save()
        .then((response) => {
          console.log("\n \n Response \n", response);
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
    const { username, postId, userId, postAuthorId } = req.body;

    const post = await Posts.findById(postId);
    if (username) {
      const alreadyLiked = post.likes.find((user) => user === username);

      if (alreadyLiked) {
        post.likes = post.likes.filter((user) => user !== username);
      } else {
        post.likes.push(username);
        createNewNotification(userId, postAuthorId, "LIKE");
      }

      return post
        .save()
        .then((response) => res.status(200).json(response))
        .catch((err) => res.status(500).send(err));
    }
    res.status(400).send("Some Error Occured");
  } catch (err) {
    console.log("\n \n Errorrrrrrr232323", err);
    res.status(500).send(err);
  }
});

router.post("/post/addcomment", verifyToken, async (req, res) => {
  try {
    const { userId, comment, postId, username, lastname, firstname, avatar } =
      req.body;

    const findPost = await Posts.findById(postId);

    console.log("\n POSTT \n ", findPost);

    console.log(
      "\n \n New Notification \n",
      "SOurceusername : ",
      username,
      "suoce Id",
      userId,
      "\n",
      "tagetNmae: ",
      findPost.username,
      "tagert iD: ",
      findPost.userId
    );

    if (comment) {
      findPost.comments.push({
        userId,
        comment,
        username,
        lastname,
        firstname,
        avatar,
      });

      createNewNotification(userId, findPost.userId, "COMMENT");

      return findPost
        .save()
        .then((response) => res.status(200).json(response))
        .catch((err) => console.log("Error while saving commenit", err));
    }
    res.status(400).send("Bad Request");
  } catch (err) {
    console.log("Error while adding comment", err);
  }
});

router.post("/findpost/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    await Posts.findById(postId)
      .then((response) => res.status(200).json(response))
      .catch((err) => {
        console.log("Error while fetchiing post", err);
        res.status(404).send("Not found");
      });
  } catch (err) {
    console.log("error fetch post ", err);
  }
});

module.exports = router;
