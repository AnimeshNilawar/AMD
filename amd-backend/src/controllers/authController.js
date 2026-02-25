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

module.exports = {
    signup,
    login
};
