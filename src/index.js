const express = require("express");
const cors = require("cors");
const app = express();

const userRouter = require("./Routers/usersRouter");

require("dotenv/config");
require("./Db/conn");

app.use(cors());
app.use(express.json());
app.use(userRouter);

app.get("/", (req, res) => {
  res.send("Server is working");
});

const PORT = 8000 || process.env.PORT;

app.listen(PORT, () => console.log("Server Started on Port", PORT));