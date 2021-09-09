const express = require("express");
const Users = require("../Models/userSchema");
const verifyToken = require("../Middleware/verifyToken");
const createNewNotification = require("../Utils/notificationGenerator");

const router = new express.Router();
const secret = process.env.JWT_SECRET;

router.post("/userdata", verifyToken, async (req, res) => {
  let authenticated = res.locals.authenticated;

  let {
    _id,
    username,
    firstname,
    lastname,
    followers,
    following,
    posts,
    avatar,
    bio,
    location,
    wallColor,
  } = await Users.findOne({ username: authenticated.username });

  let userData = {
    _id,
    username,
    firstname,
    lastname,
    followers,
    following,
    posts,
    avatar,
    bio,
    location,
    wallColor,
  };

  res.send(userData);
});

router.post("/finduser", async (req, res) => {
  try {
    let {
      _id,
      username,
      firstname,
      lastname,
      followers,
      following,
      posts,
      avatar,
      bio,
      location,
      wallColor,
    } = await Users.findOne({ username: req.body.username });
    let userData = {
      _id,
      username,
      firstname,
      lastname,
      followers,
      following,
      posts,
      avatar,
      bio,
      location,
      wallColor,
    };
    res.status(200).json(userData);
  } catch (err) {
    res.send(err);
  }
});

router.post("/search", async (req, res) => {
  try {
    let { username } = req.body;

    if (username) {
      let { username, firstname, lastname, avatar, bio } = await Users.findOne({
        username: req.body.username,
      });

      return res
        .status(200)
        .json({ username, firstname, lastname, avatar, bio });
    }
    res.status(400).send("Some Error Occured");
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/togglefollow", verifyToken, async (req, res) => {
  try {
    const { username, userId, followingTo, followingToId } = req.body;

    //Updating On LoggedIn User's Account

    const findUser = await Users.findOne({ username });

    const checkIfAlreadyFollowing = findUser.following.find(
      (username) => username === followingTo
    );

    if (checkIfAlreadyFollowing) {
      console.log("\n Alreday follwing \n");
      findUser.following = findUser.following.filter(
        (username) => username !== followingTo
      );
    } else {
      findUser.following.push(followingTo);
      console.log("\n Created follwing \n");
    }

    //Updating On Following Person's Account

    const findFollowingTo = await Users.findOne({ username: followingTo });

    const checkIfAlreadyFollowed = findFollowingTo.followers.find(
      (follower) => follower === username
    );

    if (checkIfAlreadyFollowed) {
      findFollowingTo.followers = findFollowingTo.followers.filter(
        (follower) => follower !== username
      );
    } else {
      findFollowingTo.followers.push(username);
      createNewNotification(userId, followingToId, "NEWFOLLOWER");
    }

    findUser.save();
    findFollowingTo.save();

    res.status(200).json({ User: findUser, followingTo: findFollowingTo });
  } catch (err) {
    res.send(err);
  }
});

router.post("/updateprofile", verifyToken, async (req, res) => {
  try {
    const { firstname, lastname, bio, location, wallColor } = req.body;

    let authenticated = res.locals.authenticated;

    if (wallColor) {
      return await Users.findOneAndUpdate(
        { username: authenticated.username },
        { wallColor }
      )
        .then((response) => res.status(200).send("Wall Updated"))
        .catch((err) => res.status(500).send("Some Error Occured ", err));
    }

    await Users.findOneAndUpdate(
      { username: authenticated.username },
      { firstname, lastname, bio, location }
    )
      .then((response) => res.status(200).send("Profile Updated"))
      .catch((err) => res.status(500).send("Some Error Occured ", err));
  } catch (err) {
    console.log("/n /n Some Errorr", err);
    res.send(err);
  }
});

module.exports = router;
