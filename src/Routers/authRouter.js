const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../Models/userSchema");
const avatarGenerator = require("../Utils/avatarGenerator");

const router = new express.Router();

const secret = process.env.JWT_SECRET;

const checkIfUserAlreadyExist = async (req, res, next) => {
  const { username, email } = req.body;
  const checkUsernameAvailabilty = await Users.findOne({
    username: username,
  });

  const checkEmailAvailabilty = await Users.findOne({
    email: email,
  });

  if (checkUsernameAvailabilty) {
    return res.status(409).send("Username is not available");
  }
  if (checkEmailAvailabilty) {
    return res.status(409).send("Email is already used");
  }
  next();
};

router.post("/signup", checkIfUserAlreadyExist, async (req, res) => {
  try {
    const { username, firstname, lastname, email, password } = req.body;

    const avatar = avatarGenerator(username);

    console.log("\n \n \n Avatar ", avatar);

    const newUser = Users({
      username,
      firstname,
      lastname,
      email,
      password,
      avatar,
    });
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashedPassword;
    return newUser
      .save()
      .then((user) => res.json(user))
      .catch((err) =>
        console.log("\n Error Occuerd while creating user ", err)
      );
  } catch (err) {
    res.send(err);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    console.log("THINGSgd \n", usernameOrEmail, password);

    const findUser = await Users.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });

    if (findUser) {
      const isAuthSuccessful = await bcrypt.compare(
        password,
        findUser.password
      );

      if (isAuthSuccessful) {
        let token = jwt.sign({ username: findUser.username }, secret);
        console.log("TOkkkkkeeen \n", token);
        return res.status(200).json({ token });
      }
      return res.status(401).send("Username or Password is Incorrect");
    }
    res.status(404).send("User does not exist");
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
