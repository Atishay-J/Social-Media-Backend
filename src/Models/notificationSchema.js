const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    notificationType: {
      type: String,
      enum: ["NEWFOLLOWER", "LIKE", "COMMENT"],
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      populate: { select: "firstname lastname username avatar" },
    },
    sourceUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      populate: { select: "firstname lastname username avatar" },
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
