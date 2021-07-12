const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  followers: [],
  following: [],
  avatar: String,
  bio: String,
  location: String,
  posts: [],
});

const Users = new mongoose.model("Users", UserSchema);

module.exports = Users;
