// src/routes/upload.route.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware'); // Import instance Multer

// Endpoint untuk mengunggah satu file gambar
// 'image' di sini adalah nama field yang akan digunakan di form-data (HTML input name="image")
router.post('/', upload.single('image'), (req, res) => {
  // Middleware `upload.single('image')` akan memproses file
  // Jika upload berhasil, informasi file akan tersedia di `req.file`
  if (!req.file) {
    return res.status(400).json({ message: 'Tidak ada file yang diunggah atau tipe file tidak didukung.' });
  }

  // Jika sampai sini, berarti upload berhasil
  res.status(200).json({
    status: 'success',
    message: 'File berhasil diunggah!',
    fileName: req.file.filename,
    filePath: `/uploads/${req.file.filename}` // Path yang bisa diakses publik
    // req.file akan berisi: fieldname, originalname, encoding, mimetype, destination, filename, path, size
  });
});

// Anda bisa menambahkan endpoint untuk mengunggah multiple files atau array of files juga:
// router.post('/multiple', upload.array('images', 5), (req, res) => { ... });
// router.post('/photos', upload.fields([ { name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 } ]), (req, res) => { ... });


module.exports = router;