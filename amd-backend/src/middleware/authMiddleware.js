const { supabase } = require("../services/supabaseClient");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                ok: false,
                error: "No authorization token provided"
            });
        }

        // Verify the JWT token with Supabase
        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            return res.status(401).json({
                ok: false,
                error: error?.message || "Invalid or expired token"
            });
        }

        // Attach user info to request object for use in controllers
        req.user = data.user;
        next();
    } catch (err) {
        return res.status(500).json({
            ok: false,
            error: err.message
        });
    }
};

module.exports = { authMiddleware };
