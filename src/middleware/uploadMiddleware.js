// src/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path'); // Core Node.js module untuk path

// 1. Konfigurasi Penyimpanan File (Disk Storage)
const storage = multer.diskStorage({
  // `destination` menentukan folder tujuan tempat file akan disimpan
  destination: (req, file, cb) => {
    // Parameter pertama `null` menunjukkan tidak ada error
    // Parameter kedua adalah path relatif ke folder `uploads`
    cb(null, 'uploads/'); // Pastikan folder 'uploads/' ada di root proyek Anda
  },
  // `filename` menentukan nama file yang akan disimpan
  filename: (req, file, cb) => {
    // Membuat nama file unik: nama_field-timestamp.ekstensi_asli
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    // Contoh: 'image-1678889900000-12345.png'
  }
});

// 2. Konfigurasi Filter File (Opsional, tapi sangat disarankan untuk keamanan)
const fileFilter = (req, file, cb) => {
  // Hanya izinkan jenis file gambar tertentu
  const allowedFileTypes = /jpeg|jpg|png|gif/; // Regex untuk tipe file yang diizinkan
  const mimeType = allowedFileTypes.test(file.mimetype); // Cek mime type file
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase()); // Cek ekstensi file

  if (mimeType && extname) {
    cb(null, true); // Izinkan file
  } else {
    // Tolak file dan berikan pesan error
    cb(new Error('Hanya file gambar (JPEG, JPG, PNG, GIF) yang diizinkan!'), false);
  }
};

// 3. Konfigurasi Utama Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // Batasi ukuran file hingga 2 MB (2 * 1024 * 1024 bytes)
  }
});

module.exports = upload; // Ekspor instance Multer