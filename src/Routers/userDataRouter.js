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
        return res.status(401).json({ message: "Session Expired" });
      }
      return res.status(400).json({ message: "Some Error Occured" });
    }
    return (res.locals.authenticated = decoded);
  });

  next();
};

router.post("/userdata", verifyToken, async (req, res) => {
  let authenticated = res.locals.authenticated;

  let { username, firstname, lastname, followers, following, posts } =
    await Users.findOne({ username: authenticated.username });

  let userData = {
    username,
    firstname,
    lastname,
    followers,
    following,
    posts,
  };

  res.send(userData);
});

module.exports = router;
