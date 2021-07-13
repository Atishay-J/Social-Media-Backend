const express = require("express");
const router = new express.Router();
const verifyToken = require("../Middleware/verifyToken");
const Notification = require("../Models/notificationSchema");

router.post("/notifications", verifyToken, async (req, res) => {
  console.log("Userse IDDD", req.body);
  try {
    const notifications = await Notification.find({
      targetUser: req.body.userId,
    }).populate("sourceUser");

    console.log("\n \n Notifcitcaonasf \n", notifications);
    res.status(200).send(notifications);
  } catch (err) {
    console.log("\n \n Errorrrr\n", err);
    res.status(500).send(err);
  }
});

module.exports = router;
