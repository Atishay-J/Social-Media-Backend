const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    postContent: { type: String, required: true },
    likes: [],
    comments: [],
    avatar: { type: String, required: true },
  },
  { timestamps: true }
);

const Posts = new mongoose.model("Posts", PostSchema);

module.exports = Posts;
