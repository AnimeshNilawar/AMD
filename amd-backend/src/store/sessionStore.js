// sessionStore.js
// Simple in-memory session store for multi-turn chat
// ⚠️ Replace with Redis or Supabase for production

const sessions = {};

/**
 * Get session by ID
 * If session does not exist, initialize a new one
 * @param {string} sessionId
 * @returns {object} session
 */
function getSession(sessionId) {
    if (!sessions[sessionId]) {
        sessions[sessionId] = {
            stage: "new",         // stages: new -> destination_suggested -> itinerary_built
            intent: null,         // stores TravelIntent object from ML service
            destination: null,    // stores chosen destination object
            itinerary: null       // stores itinerary JSON returned by ML service
        };
    }
    return sessions[sessionId];
}

/**
 * Update session fields
 * Merges new data into existing session
 * @param {string} sessionId
 * @param {object} data
 */
function updateSession(sessionId, data) {
    if (!sessions[sessionId]) {
        getSession(sessionId);
    }
    sessions[sessionId] = {
        ...sessions[sessionId],
        ...data
    };
}

/**
 * Optional: clear a session (for testing or after trip completion)
 * @param {string} sessionId
 */
function clearSession(sessionId) {
    delete sessions[sessionId];
}

/**
 * Optional: get all active sessions (debugging)
 */
function getAllSessions() {
    return sessions;
}

module.exports = {
    getSession,
    updateSession,
    clearSession,
    getAllSessions
};