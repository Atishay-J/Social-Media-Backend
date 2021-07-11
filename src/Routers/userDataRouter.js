const express = require("express");
const Users = require("../Models/userSchema");
const verifyToken = require("../Middleware/verifyToken");

const router = new express.Router();
const secret = process.env.JWT_SECRET;

router.post("/userdata", verifyToken, async (req, res) => {
  let authenticated = res.locals.authenticated;

  console.log("\n \n \n Autheticated \n \n \n ", authenticated);

  let { username, firstname, lastname, followers, following, posts, avatar } =
    await Users.findOne({ username: authenticated.username });

  let userData = {
    username,
    firstname,
    lastname,
    followers,
    following,
    posts,
    avatar,
  };

  res.send(userData);
});

router.post("/finduser", async (req, res) => {
  console.log("Finding Usererrr", req.body);
  try {
    let { username, firstname, lastname, followers, following, posts, avatar } =
      await Users.findOne({ username: req.body.username });
    let userData = {
      username,
      firstname,
      lastname,
      followers,
      following,
      posts,
      avatar,
    };
    console.log("Userdata", userData);
    res.status(200).json(userData);
  } catch (err) {
    res.send(err);
  }
});

router.post("/togglefollow", verifyToken, async (req, res) => {
  try {
    const { username, follower } = req.body;
    res.json({ username, follower });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
