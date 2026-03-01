const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
    getUserProfile,
    getUserHistory,
    getRecommendations,
    getSimilarUserPlaces
} = require("../controllers/userController");

const router = express.Router();

router.get("/profile", authMiddleware, getUserProfile);
router.get("/history", getUserHistory);
router.get("/recommendations", getRecommendations);
router.get("/similar-users/places", getSimilarUserPlaces);

module.exports = router;
