const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./Db/conn");

const app = express();
const authRouter = require("./Routers/authRouter");
const userDataRouter = require("./Routers/userDataRouter");
const postsRouter = require("./Routers/postsRouter");

app.use(cors());
app.use(express.json());
app.use(authRouter);
app.use(userDataRouter);
app.use(postsRouter);

app.get("/", (req, res) => {
  res.send("Server is working");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log("Server Started on Port", PORT));
