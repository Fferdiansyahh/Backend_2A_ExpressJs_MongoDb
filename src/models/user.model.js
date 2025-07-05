// src/models/user.model.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Definisikan skema untuk User
const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: [true, "Fullname harus diisi"], // Membuat field ini wajib diisi
      trim: true, // Menghapus spasi di awal dan akhir string
    },
    username: {
      type: String,
      required: [true, "Username harus diisi"],
      unique: true, // Memastikan setiap username bersifat unik
      trim: true,
      lowercase: true, // Menyimpan username dalam huruf kecil
    },
    email: {
      type: String,
      required: [true, "Email harus diisi"],
      unique: true, // Memastikan setiap email bersifat unik
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password harus diisi"],
    },

    verificationToken: {
      type: String,
      default: null, // Defaultnya null sampai token dibuat saat registrasi
    },

    isVerified: {
      type: Boolean,
      default: false, // Defaultnya false, menjadi true setelah email diverifikasi
    },
  },
  {
    // Opsi ini akan secara otomatis menambahkan field createdAt dan updatedAt
    timestamps: true,
  }
);

// Membuat dan mengekspor model User
const User = mongoose.model("User", userSchema);

module.exports = User;
