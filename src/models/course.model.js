const mongoose = require("mongoose");

const CourseSchema = mongoose.Schema(
  {
    judul: {
      type: String,
      require: [true, "Judul course harus diisi"],
    },

    deskripsi: {
      type: String,
      require: [true, "Deskripsi course harus diisi"],
    },
    harga: {
      type: Number,
      require: true,
      default: 0,
    },

    image: {
      type: String,
      require: false,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
