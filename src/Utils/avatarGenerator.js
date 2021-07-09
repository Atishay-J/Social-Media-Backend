const avatarGenerator = (seed) => {
  const avatarURL = `https://avatars.dicebear.com/api/micah/${seed}.svg`;
  return avatarURL;
};
module.exports = avatarGenerator;
