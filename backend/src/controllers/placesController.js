const { places } = require("../mock/places");

// Get all places with optional filtering and sorting
const getPlaces = (req, res) => {
    try {
        const { category = "All", sortBy = "distance" } = req.query;

        let filtered = places;

        // Filter by category
        if (category !== "All" && category !== "Trending") {
            filtered = filtered.filter(p => p.category === category);
        }

        // Sort
        if (sortBy === "score") {
            filtered.sort((a, b) => b.experience_score - a.experience_score);
        } else if (sortBy === "crowd") {
            const crowdOrder = { low: 1, med: 2, high: 3 };
            filtered.sort((a, b) => crowdOrder[a.crowd_level] - crowdOrder[b.crowd_level]);
        } else {
            // distance (default)
            filtered.sort((a, b) => a.distance_km - b.distance_km);
        }

        // Return only card-level fields (not full details)
        const response = filtered.map(p => ({
            id: p.id,
            name: p.name,
            emoji: p.emoji,
            bg: p.bg,
            category: p.category,
            tags: p.tags,
            crowd_level: p.crowd_level,
            experience_score: p.experience_score,
            distance_km: p.distance_km,
            drive_time: p.drive_time,
            price_label: p.price_label
        }));

        return res.json(response);
    } catch (err) {
        return res.status(500).json({
            error: "PLACES_FETCH_ERROR",
            message: err.message
        });
    }
};

// Get a single place by ID with full details
const getPlaceById = (req, res) => {
    try {
        const { id } = req.params;
        const place = places.find(p => p.id === id);

        if (!place) {
            return res.status(404).json({
                error: "PLACE_NOT_FOUND",
                message: `No place exists with the ID '${id}'`
            });
        }

        return res.json(place);
    } catch (err) {
        return res.status(500).json({
            error: "PLACE_FETCH_ERROR",
            message: err.message
        });
    }
};

// Get trending places
const getTrendingPlaces = (req, res) => {
    try {
        const trending = [
            {
                id: "rajmachi",
                name: "Rajmachi Trek",
                emoji: "🥾",
                reason_text: "Searches up 140% this week",
                category: "forest",
                badge: "🔥 Trending"
            },
            {
                id: "alibaug",
                name: "Alibaug Beach",
                emoji: "🏖️",
                reason_text: "Hot pick for Feb long weekend",
                category: "beach",
                badge: "🔥 Trending"
            },
            {
                id: "karla",
                name: "Karla Caves",
                emoji: "🕌",
                reason_text: "Trending on Instagram Reels",
                category: "cave",
                badge: "📸 Viral"
            }
        ];

        return res.json(trending);
    } catch (err) {
        return res.status(500).json({
            error: "TRENDING_FETCH_ERROR",
            message: err.message
        });
    }
};

// Get crowd timeline for a place
const getCrowdTimeline = (req, res) => {
    try {
        const { id } = req.params;
        const place = places.find(p => p.id === id);

        if (!place) {
            return res.status(404).json({
                error: "PLACE_NOT_FOUND",
                message: `No place exists with the ID '${id}'`
            });
        }

        return res.json({
            hours: place.crowd_timeline.hours,
            best_window: place.crowd_timeline.best_window
        });
    } catch (err) {
        return res.status(500).json({
            error: "CROWD_TIMELINE_ERROR",
            message: err.message
        });
    }
};

// Get nearby food and hotels
const getNearby = (req, res) => {
    try {
        const { id } = req.params;
        const place = places.find(p => p.id === id);

        if (!place) {
            return res.status(404).json({
                error: "PLACE_NOT_FOUND",
                message: `No place exists with the ID '${id}'`
            });
        }

        return res.json(place.nearby);
    } catch (err) {
        return res.status(500).json({
            error: "NEARBY_FETCH_ERROR",
            message: err.message
        });
    }
};

// Get teams for a place
const getTeams = (req, res) => {
    try {
        const { id } = req.params;
        const place = places.find(p => p.id === id);

        if (!place) {
            return res.status(404).json({
                error: "PLACE_NOT_FOUND",
                message: `No place exists with the ID '${id}'`
            });
        }

        return res.json(place.teams);
    } catch (err) {
        return res.status(500).json({
            error: "TEAMS_FETCH_ERROR",
            message: err.message
        });
    }
};

// Get similar places
const getSimilarPlaces = (req, res) => {
    try {
        const { id } = req.params;
        const place = places.find(p => p.id === id);

        if (!place) {
            return res.status(404).json({
                error: "PLACE_NOT_FOUND",
                message: `No place exists with the ID '${id}'`
            });
        }

        return res.json(place.similar);
    } catch (err) {
        return res.status(500).json({
            error: "SIMILAR_PLACES_ERROR",
            message: err.message
        });
    }
};

// Get itinerary for a place
const getItinerary = (req, res) => {
    try {
        const { id } = req.params;
        const place = places.find(p => p.id === id);

        if (!place) {
            return res.status(404).json({
                error: "PLACE_NOT_FOUND",
                message: `No place exists with the ID '${id}'`
            });
        }

        return res.json({
            itinerary: place.itinerary
        });
    } catch (err) {
        return res.status(500).json({
            error: "ITINERARY_ERROR",
            message: err.message
        });
    }
};

module.exports = {
    getPlaces,
    getPlaceById,
    getTrendingPlaces,
    getCrowdTimeline,
    getNearby,
    getTeams,
    getSimilarPlaces,
    getItinerary
};
