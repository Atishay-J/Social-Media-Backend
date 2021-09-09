const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  let authToken = req.headers.authorization;
  const secret = process.env.JWT_SECRET;

  jwt.verify(authToken, secret, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        console.log("\n \n \n Token Expired Error ");
        return res.status(401).json({ message: "Session Expired" });
      }

      console.log("\n \n \n Some Error Occured ");
      return res.status(400).json({ message: "Some Error Occured" });
    } else {
      console.log("\n \n \n Auth Granted ");
      res.locals.authenticated = decoded;
      next();
    }
  });
};

module.exports = verifyToken;
