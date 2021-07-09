const express = require("express");
const jwt = require("jsonwebtoken");
const Posts = require("../Models/postSchema");

const router = new express.Router();
const secret = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  let authToken = req.headers.authorization;

  jwt.verify(authToken, secret, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        console.log("\n \n \n Token Expired Error ");
        return res.status(401).json({ message: "Session Expired" });
      }

      console.log("\n \n \n Some Error Occured ");
      return res.status(400).json({ message: "Some Error Occured" });
    } else {
      console.log("\n \n \n Auth Granted ");
      res.locals.authenticated = decoded;
      next();
    }
  });
};

router.post("/createpost", verifyToken, async (req, res) => {
  try {
    let authenticated = res.locals.authenticated;

    console.log("\n \n \n Autheticated \n \n \n ", authenticated);

    const { username, postContent } = req.body;
    console.log("REquerst Body", username);
    const newPost = new Posts({ username, postContent })
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

module.exports = router;
