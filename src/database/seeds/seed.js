require("dotenv").config();
const mongoose = require("mongoose");
const Course = require("../../models/course.model");


const dummyData = [
  {
    judul: "HTML Dasar",
    deskripsi: "Belajar struktur HTML",
    harga: 100000,
    image: "https://via.placeholder.com/150?text=HTML"
  },
  {
    judul: "CSS Dasar",
    deskripsi: "Styling dengan CSS",
    harga: 120000,
    image: "https://via.placeholder.com/150?text=CSS"
  },
  {
    judul: "JavaScript Dasar",
    deskripsi: "Logika pemrograman dasar",
    harga: 150000,
    image: "https://via.placeholder.com/150?text=JS"
  },
  {
    judul: "React JS",
    deskripsi: "Frontend dengan React",
    harga: 200000,
    image: "https://via.placeholder.com/150?text=React"
  },
  {
    judul: "Node.js",
    deskripsi: "Backend API dengan Express",
    harga: 180000,
    image: "https://via.placeholder.com/150?text=Node"
  },
  {
    judul: "MongoDB",
    deskripsi: "Database NoSQL MongoDB",
    harga: 160000,
    image: "https://via.placeholder.com/150?text=Mongo"
  },
  {
    judul: "Git & GitHub",
    deskripsi: "Version control modern",
    harga: 100000,
    image: "https://via.placeholder.com/150?text=Git"
  },
  {
    judul: "UI/UX Design",
    deskripsi: "Desain antarmuka & pengalaman pengguna",
    harga: 140000,
    image: "https://via.placeholder.com/150?text=UIUX"
  },
  {
    judul: "Next.js",
    deskripsi: "React framework untuk SSR",
    harga: 220000,
    image: "https://via.placeholder.com/150?text=Next"
  },
  {
    judul: "TypeScript",
    deskripsi: "JS dengan tipe yang kuat",
    harga: 175000,
    image: "https://via.placeholder.com/150?text=TS"
  }
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");
    await Course.deleteMany(); // kosongkan koleksi dulu
    await Course.insertMany(dummyData);
    console.log("✅ Dummy data inserted successfully");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ Error inserting dummy data:", err.message);
    process.exit(1);
  });
