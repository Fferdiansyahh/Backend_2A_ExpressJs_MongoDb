// src/middleware/auth.middleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const protect = async (req, res, next) => {
  let token;

  // 1. Cek apakah ada token di header 'Authorization' dan dimulai dengan 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Ambil token dari header (setelah 'Bearer ')
      token = req.headers.authorization.split(' ')[1];

      // 3. Verifikasi token menggunakan secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Jika token valid, cari user di database berdasarkan id dari token
      // dan tambahkan data user ke object 'req' agar bisa diakses di controller selanjutnya.
      // '-password' berarti kita tidak ingin mengambil field password.
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User tidak ditemukan' });
      }

      // 5. Lanjutkan ke middleware/controller berikutnya
      next();
    } catch (error) {
      // Jika terjadi error saat verifikasi (misal: token kadaluarsa, tidak valid)
      console.error(error);
      return res.status(401).json({ message: 'Otorisasi gagal, token tidak valid' });
    }
  }

  // Jika tidak ada token sama sekali
  if (!token) {
    return res.status(401).json({ message: 'Otorisasi gagal, tidak ada token' });
  }
};

module.exports = { protect };