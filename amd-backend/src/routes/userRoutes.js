const express = require("express");
const {
    getUserProfile,
    getUserHistory,
    getRecommendations,
    getSimilarUserPlaces
} = require("../controllers/userController");

const router = express.Router();

router.get("/profile", getUserProfile);
router.get("/history", getUserHistory);
router.get("/recommendations", getRecommendations);
router.get("/similar-users/places", getSimilarUserPlaces);

module.exports = router;
