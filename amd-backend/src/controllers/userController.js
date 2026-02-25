// User controller with mock data
const getUserProfile = (req, res) => {
    try {
        // Get authenticated user from request (attached by authMiddleware)
        const authenticatedUser = req.user;

        if (!authenticatedUser) {
            return res.status(401).json({
                ok: false,
                error: "User not authenticated"
            });
        }

        const profile = {
            id: authenticatedUser.id,
            email: authenticatedUser.email,
            firstName: authenticatedUser.user_metadata?.full_name || "User",
            phone: authenticatedUser.user_metadata?.phone || "",
            createdAt: authenticatedUser.created_at,
            lastSignInAt: authenticatedUser.last_sign_in_at,
            // Mock data - replace with actual database queries
            tripCount: 3,
            lastVisit: {
                placeName: "Rajmachi Trek",
                date: "Jan 12"
            },
            interests: ["nature", "trekking", "offbeat spots"]
        };

        return res.json({
            ok: true,
            user: profile
        });
    } catch (err) {
        return res.status(500).json({
            ok: false,
            error: "PROFILE_FETCH_ERROR",
            message: err.message
        });
    }
};

const getUserHistory = (req, res) => {
    try {
        const history = [
            {
                placeId: "rajmachi",
                name: "Rajmachi Trek",
                emoji: "🥾",
                category: "forest",
                lastVisited: "Jan 12",
                current_crowd_label: "Low crowd this weekend",
                current_crowd_color: "low"
            },
            {
                placeId: "alibaug",
                name: "Alibaug Beach",
                emoji: "🏖️",
                category: "beach",
                lastVisited: "Dec 24",
                current_crowd_label: "Low crowd this Sunday",
                current_crowd_color: "low"
            },
            {
                placeId: "sinhagad",
                name: "Sinhagad Fort",
                emoji: "⛰️",
                category: "mtn",
                lastVisited: "Nov 5",
                current_crowd_label: "Moderate crowd Sat",
                current_crowd_color: "med"
            }
        ];

        return res.json(history);
    } catch (err) {
        return res.status(500).json({
            error: "HISTORY_FETCH_ERROR",
            message: err.message
        });
    }
};

const getRecommendations = (req, res) => {
    try {
        const recommendations = [
            {
                id: "harishchandragad",
                name: "Harishchandragad",
                emoji: "🌄",
                bg: "mtn",
                category: "Trekking",
                tags: ["Trekking", "Nature"],
                crowd_level: "low",
                experience_score: 93,
                distance_km: 130,
                drive_time: "2.5h",
                price_label: "₹800"
            },
            {
                id: "kalsubai",
                name: "Kalsubai Peak",
                emoji: "⛰️",
                bg: "forest",
                category: "Trekking",
                tags: ["Trekking", "Nature"],
                crowd_level: "low",
                experience_score: 89,
                distance_km: 165,
                drive_time: "3h",
                price_label: "Free"
            }
        ];

        return res.json(recommendations);
    } catch (err) {
        return res.status(500).json({
            error: "RECOMMENDATIONS_ERROR",
            message: err.message
        });
    }
};

const getSimilarUserPlaces = (req, res) => {
    try {
        const similarPlaces = [
            { placeId: "alibaug", name: "Alibaug", emoji: "🏖️" },
            { placeId: "sinhagad", name: "Sinhagad", emoji: "🏰" },
            { placeId: "karla", name: "Karla Caves", emoji: "🕌" },
            { placeId: "rajmachi", name: "Rajmachi", emoji: "🥾" }
        ];

        return res.json(similarPlaces);
    } catch (err) {
        return res.status(500).json({
            error: "SIMILAR_USERS_ERROR",
            message: err.message
        });
    }
};

module.exports = {
    getUserProfile,
    getUserHistory,
    getRecommendations,
    getSimilarUserPlaces
};
