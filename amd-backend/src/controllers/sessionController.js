const { supabase } = require("../services/supabaseClient");

async function listSessions(req, res) {
    try {
        const { data, error } = await supabase
            .from("sessions")
            .select("id, title, created_at, updated_at")
            .eq("user_id", req.user.id)
            .order("updated_at", { ascending: false });

        if (error) throw error;

        res.json({
            ok: true,
            sessions: data
        });

    } catch (err) {
        res.status(500).json({
            ok: false,
            error: err.message
        });
    }
}

async function updateSessionTitle(req, res) {
    try {
        const { id } = req.params;
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({
                ok: false,
                error: "Title is required"
            });
        }

        const { data, error } = await supabase
            .from("sessions")
            .update({ title })
            .eq("id", id)
            .eq("user_id", req.user.id) // prevent editing others' sessions
            .select()
            .single();

        if (error) throw error;

        res.json({
            ok: true,
            session: data
        });

    } catch (err) {
        res.status(500).json({
            ok: false,
            error: err.message
        });
    }
}

async function deleteSession(req, res) {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from("sessions")
            .delete()
            .eq("id", id)
            .eq("user_id", req.user.id);

        if (error) throw error;

        res.json({ ok: true, message: "Session deleted successfully" });

    } catch (err) {
        res.status(500).json({
            ok: false,
            error: err.message
        });
    }
}

module.exports = {
    listSessions,
    updateSessionTitle,
    deleteSession
};
