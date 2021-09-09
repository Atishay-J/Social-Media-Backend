const express = require("express");
var cors = require("cors");
require("dotenv").config();
require("./Db/conn");

const app = express();
app.use(cors({ credentials: true, origin: true }));
const authRouter = require("./Routers/authRouter");
const userDataRouter = require("./Routers/userDataRouter");
const postsRouter = require("./Routers/postsRouter");
const notificationRouter = require("./Routers/notificationRouter");

app.use(express.json());
app.use(authRouter);
app.use(userDataRouter);
app.use(postsRouter);
app.use(notificationRouter);

app.get("/", (req, res) => {
  res.send("Server is working");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log("Server Started on Port", PORT));
