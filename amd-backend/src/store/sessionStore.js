const { supabase } = require("../services/supabaseClient");

// Get or create session
async function getSession(sessionId, userId) {
    const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("id", sessionId)
        .eq("user_id", userId)
        .single();

    if (error && error.code !== "PGRST116") {
        throw error;
    }

    if (!data) {
        const { data: newSession, error: insertError } = await supabase
            .from("sessions")
            .insert({
                id: sessionId,
                user_id: userId,
                history: [],
                suggested_places: []
            })
            .select()
            .single();

        if (insertError) throw insertError;

        return newSession;
    }

    return data;
}

// Update session
async function updateSession(sessionId, userId, updates) {
    const { error } = await supabase
        .from("sessions")
        .update({
            ...updates,
            updated_at: new Date()
        })
        .eq("id", sessionId)
        .eq("user_id", userId);

    if (error) throw error;
}

module.exports = {
    getSession,
    updateSession
};