const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../Models/userSchema");
const avatarGenerator = require("../Utils/avatarGenerator");
const verifyToken = require("../Middleware/verifyToken");

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

router.post("/updatePassword", verifyToken, async (req, res) => {
  try {
    let { currentPassword, newPassword, username } = req.body;

    const findUser = await Users.findOne({ username });

    if (findUser) {
      const isAuthSuccessful = await bcrypt.compare(
        currentPassword,
        findUser.password
      );

      if (isAuthSuccessful) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        return await Users.updateOne({ username }, { password: hashedPassword })
          .then((response) => res.status(200).send("Updated"))
          .catch((err) => console.log("Errorrrrr", err));
      }
      return res.status(401).send("Username or Password is Incorrect");
    }
  } catch (err) {
    res.status(500).send("some error occured");
  }
});

module.exports = router;
