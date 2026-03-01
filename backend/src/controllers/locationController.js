// Location controller
const getLocation = (req, res) => {
    try {
        // In production, use IP geolocation or user's GPS coordinates
        // For now, returning default location
        return res.json({
            city: "Pune",
            state: "MH"
        });
    } catch (err) {
        return res.status(500).json({
            error: "LOCATION_ERROR",
            message: err.message
        });
    }
};

module.exports = {
    getLocation
};
