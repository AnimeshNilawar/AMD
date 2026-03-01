const express = require("express");
const {
    getPlaces,
    getPlaceById,
    getTrendingPlaces,
    getCrowdTimeline,
    getNearby,
    getTeams,
    getSimilarPlaces,
    getItinerary
} = require("../controllers/placesController");

const router = express.Router();

router.get("/", getPlaces);
router.get("/trending", getTrendingPlaces);
router.get("/:id", getPlaceById);
router.get("/:id/crowd-timeline", getCrowdTimeline);
router.get("/:id/nearby", getNearby);
router.get("/:id/teams", getTeams);
router.get("/:id/similar", getSimilarPlaces);
router.get("/:id/itinerary", getItinerary);

module.exports = router;
