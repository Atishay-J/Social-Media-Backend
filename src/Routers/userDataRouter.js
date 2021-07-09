const express = require("express");
const jwt = require("jsonwebtoken");
const Users = require("../Models/userSchema");

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

module.exports = router;
