// db.js
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connect Database is Successfully");
  } catch (error) {
    console.error("Connect failed", error);
    process.exit(1); // keluar dari proses jika gagal
  }
};

module.exports = connectDB;
