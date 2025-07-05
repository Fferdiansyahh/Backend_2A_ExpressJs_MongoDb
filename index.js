const path = require("path");
require("dotenv").config();

const express = require("express");
const courseRoute = require("./src/routes/course.route");
const connectDB = require("./src/configs/db");
const userRoute = require("./src/routes/user.route"); 
const uploadRoute = require("./src/routes/upload.route");

const app = express();

const PORT = process.env.PORT;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/course", courseRoute);
app.use("/", userRoute);
app.use("/upload", uploadRoute);
app.get("/", (req, res) => {
  res.send("Hello Ferdian, your server running");z
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server run on port ${PORT}`);
  });
});
