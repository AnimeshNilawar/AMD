const { supabase } = require("../services/supabaseClient");

const signup = async (req, res) => {
    const { email, password, metadata } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({
            ok: false,
            error: "email and password are required"
        });
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: metadata ? { data: metadata } : undefined
        });

        if (error) {
            return res.status(400).json({
                ok: false,
                error: error.message
            });
        }

        return res.status(201).json({
            ok: true,
            user: data.user,
            session: data.session
        });
    } catch (err) {
        return res.status(500).json({
            ok: false,
            error: err.message
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({
            ok: false,
            error: "email and password are required"
        });
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return res.status(401).json({
                ok: false,
                error: error.message
            });
        }

        return res.json({
            ok: true,
            user: data.user,
            session: data.session
        });
    } catch (err) {
        return res.status(500).json({
            ok: false,
            error: err.message
        });
    }
};

const logout = async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            return res.status(400).json({
                ok: false,
                error: error.message
            });
        }

        return res.json({
            ok: true,
            message: "Logged out successfully"
        });
    } catch (err) {
        return res.status(500).json({
            ok: false,
            error: err.message
        });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                ok: false,
                error: "No token provided"
            });
        }

        const { data, error } = await supabase.auth.getUser(token);

        if (error) {
            return res.status(401).json({
                ok: false,
                error: error.message
            });
        }

        return res.json({
            ok: true,
            user: data.user
        });
    } catch (err) {
        return res.status(500).json({
            ok: false,
            error: err.message
        });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { refresh_token } = req.body || {};

        if (!refresh_token) {
            return res.status(400).json({
                ok: false,
                error: "refresh_token is required"
            });
        }

        const { data, error } = await supabase.auth.refreshSession({
            refresh_token
        });

        if (error) {
            return res.status(401).json({
                ok: false,
                error: error.message
            });
        }

        return res.json({
            ok: true,
            session: data.session
        });
    } catch (err) {
        return res.status(500).json({
            ok: false,
            error: err.message
        });
    }
};

module.exports = {
    signup,
    login,
    logout,
    getCurrentUser,
    refreshToken
};
