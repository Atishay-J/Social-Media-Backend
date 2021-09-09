const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    firstname: { type: String },
    lastname: { type: String },
    postContent: { type: String },
    postImg: { type: String },
    likes: [],
    comments: [],
    avatar: { type: String, required: true },
  },
  { timestamps: true }
);

const Posts = new mongoose.model("Posts", PostSchema);

module.exports = Posts;
