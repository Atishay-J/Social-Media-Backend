const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  postContent: { type: String, required: true },
  likes: [],
  comments: [],
});

const Posts = new mongoose.model("Posts", PostSchema);

module.exports = Posts;
