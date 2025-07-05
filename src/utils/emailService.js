// src/utils/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config(); // Pastikan .env dimuat di sini juga jika file ini berdiri sendiri

// Konfigurasi transporter email
// Untuk Gmail, Anda mungkin perlu menggunakan "App Passwords" jika 2FA aktif.
// Kunjungi: myaccount.google.com/security -> App passwords
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // e.g., 'smtp.gmail.com'
    port: process.env.EMAIL_PORT, // e.g., 587 (for STARTTLS) or 465 (for SSL/TLS)
    secure: process.env.EMAIL_SECURE === 'true', // true for port 465, false for other ports (like 587)
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app password
    },
});

// Fungsi untuk mengirim email verifikasi
const sendVerificationEmail = async (userEmail, verificationToken) => {
    // Pastikan BASE_URL Anda di .env sesuai dengan alamat server Anda (contoh: http://localhost:3000)
    const verificationLink = `${process.env.BASE_URL}/verify-email/${verificationToken}`;

    const mailOptions = {
        from: process.env.EMAIL_FROM, // Email pengirim (bisa nama + email)
        to: userEmail,
        subject: 'Verifikasi Akun EduCourse Anda',
        html: `
            <p>Halo,</p>
            <p>Terima kasih telah mendaftar di EduCourse. Silakan klik link di bawah ini untuk memverifikasi akun Anda:</p>
            <p><a href="${verificationLink}">Verifikasi Akun Saya</a></p>
            <p>Jika Anda tidak merasa mendaftar, abaikan email ini.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email verifikasi berhasil dikirim ke ${userEmail}`);
    } catch (error) {
        console.error(`Gagal mengirim email verifikasi ke ${userEmail}:`, error);
        throw new Error('Gagal mengirim email verifikasi.'); // Lempar error agar bisa ditangkap di controller
    }
};

module.exports = { sendVerificationEmail };