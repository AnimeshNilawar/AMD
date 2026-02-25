const express = require("express");
const { signup, login, logout, getCurrentUser, refreshToken } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.get("/me", getCurrentUser);

module.exports = router;
