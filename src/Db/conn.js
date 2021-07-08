const mongoose = require("mongoose");

const URI = process.env.DB_URI;

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Error while connecting Database \n", err));
