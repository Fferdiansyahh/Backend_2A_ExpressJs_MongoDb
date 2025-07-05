// src/routes/user.route.js

const express = require("express");
const router = express.Router();
const { registerUser, loginUser, verifyEmail } = require("../controllers/user.controller");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/verify-email/:token", verifyEmail);

module.exports = router;
