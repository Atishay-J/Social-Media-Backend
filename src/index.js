const express = require("express");
const cors = require("cors");
require("dotenv/config");
require("./Db/conn");

const app = express();
const authRouter = require("./Routers/authRouter");
const userDataRouter = require("./Routers/userDataRouter");

app.use(cors());
app.use(express.json());
app.use(authRouter);
app.use(userDataRouter);

app.get("/", (req, res) => {
  res.send("Server is working");
});

const PORT = 8000 || process.env.PORT;

app.listen(PORT, () => console.log("Server Started on Port", PORT));
