const Notification = require("../Models/notificationSchema");
const createNewNotification = async (
  sourceUser,
  targetUser,
  notificationType
) => {
  console.log("\n \n Create New Notification Called\n");

  try {
    const notification = {
      notificationType,
      // targetUser: userId,
      // sourceUser: followerId,
      targetUser,
      sourceUser,
    };

    const newNotification = new Notification(notification);

    await newNotification
      .save()
      .then((response) => {
        console.log("\n \n Notification Response \n ", response);
      })
      .catch((err) => {
        console.log(" \n \n Notfication Error \n", err);
      });
  } catch (err) {
    console.log(err);
  }
};

module.exports = createNewNotification;
