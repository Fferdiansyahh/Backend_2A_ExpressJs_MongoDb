// src/controllers/user.controller.js

const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { sendVerificationEmail } = require("../utils/emailService");

// Fungsi untuk membuat user baru (Registrasi)
const registerUser = async (req, res) => {
  const { fullname, username, email, password } = req.body;

  if (!fullname || !username || !email || !password) {
    return res.status(400).json({ message: "Semua field harus diisi" });
  }
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email atau Username sudah terdaftar" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();

    const newUser = new User({
      fullname,
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      verificationToken: verificationToken,
      isVerified: false,
    });

    const savedUser = await newUser.save();
    await sendVerificationEmail(savedUser.email, verificationToken);

    res.status(201).json({
      message:
        "Registrasi berhasil! Silakan cek email Anda untuk memverifikasi akun.",
      user: {
        id: savedUser._id,
        fullname: savedUser.fullname,
        username: savedUser.username,
        email: savedUser.email,
        isVerified: savedUser.isVerified,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// --- FUNGSI BARU UNTUK LOGIN ---
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validasi input
  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password harus diisi" });
  }

  try {
    // 2. Cari user berdasarkan email
    const user = await User.findOne({ email: email.toLowerCase() });

    // Jika user tidak ditemukan, kirim respons error.
    // Pesan error sengaja dibuat sama untuk tidak memberitahu penyerang apakah emailnya yang salah atau passwordnya.
    if (!user) {
      return res.status(401).json({ message: "Email atau password salah" }); // 401 Unauthorized
    }
    // --- Tambahkan pengecekan status verifikasi email ---
    if (!user.isVerified) {
      return res
        .status(401)
        .json({ message: "Akun belum diverifikasi. Silakan cek email Anda." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Email atau password salah" }); // 401 Unauthorized
    }

    // 4. Buat payload untuk token. Isi dengan data yang tidak sensitif.
    const payload = {
      id: user._id,
      username: user.username,
    };

    // 5. Buat token JWT
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET, // Ambil secret key dari .env
      { expiresIn: "1h" } // Token akan kadaluarsa dalam 1 jam
    );

    // 6. Kirim respons sukses beserta token
    res.status(200).json({
      message: "Login berhasil!",
      token: token, // Kirim token ke client
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.params; // Ambil token dari parameter URL

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid Verification Token" });
    }

    // Optional: Jika user sudah diverifikasi sebelumnya
    if (user.isVerified) {
      return res.status(200).json({ message: "Email already verified" });
    }

    user.isVerified = true; // Set status menjadi diverifikasi
    user.verificationToken = null; // Hapus token setelah digunakan (opsional, tapi disarankan untuk keamanan)

    await user.save(); // Simpan perubahan ke database

    res.status(200).json({ message: "Email Verified Successfully" });
  } catch (error) {
    console.error("Error during email verification:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
};
