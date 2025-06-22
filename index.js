const path = require("path");
require("dotenv").config();

const express = require("express");
const courseRoute = require("./src/routes/course.route");
const connectDB = require("./src/configs/db");

const app = express();

const PORT = process.env.PORT;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/course", courseRoute);
app.get("/", (req, res) => {
  res.send("Hello Ferdian, your server running");
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server run on port ${PORT}`);
  });
});
