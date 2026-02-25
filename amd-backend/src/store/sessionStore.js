// Simple in-memory session store (replace with Redis or DB in production)
const sessions = {};

function getSession(sessionId) {
    if (!sessions[sessionId]) {
        sessions[sessionId] = {
            stage: "new",
            intent: null,
            destination: null,
            itinerary: null,
            history: [],          // conversation history [{ role, content }]
            suggestedPlaces: []   // list of suggested place names
        };
    }
    return sessions[sessionId];
}

function updateSession(sessionId, data) {
    sessions[sessionId] = {
        ...sessions[sessionId],
        ...data
    };
}

module.exports = {
    getSession,
    updateSession
};