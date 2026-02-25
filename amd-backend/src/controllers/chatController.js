const { v4: uuidv4 } = require("uuid");
const { getSession, updateSession } = require("../store/sessionStore");

// Your ML backend URL (FastAPI service)
const ML_BACKEND_URL = process.env.ML_BACKEND_URL || "http://localhost:8000/api/chat";

async function sendChatMessage(req, res) {
    try {
        const { message, sessionId } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Get or create session
        const id = sessionId || uuidv4();
        const session = getSession(id);

        // Initialize if missing
        session.history = session.history || [];
        session.suggestedPlaces = session.suggestedPlaces || [];

        // Append current user message to history
        session.history.push({ role: "User", content: message });

        // Prepare payload for ML backend
        const payload = {
            message,
            history: session.history,
            suggested_places: session.suggestedPlaces
        };

        // Call ML backend
        const mlResponse = await fetch(ML_BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!mlResponse.ok) {
            throw new Error(`ML backend error: ${mlResponse.status}`);
        }

        const data = await mlResponse.json();

        // Append bot reply to session history
        session.history.push({ role: "Bot", content: data.reply });

        // Update suggestedPlaces to avoid repeats
        if (data.suggested_place_name) {
            if (!session.suggestedPlaces.includes(data.suggested_place_name)) {
                session.suggestedPlaces.push(data.suggested_place_name);
            }
        }

        // Save updated session data
        updateSession(id, session);

        // Send response back to frontend with sessionId for continuity
        res.json({
            sessionId: id,
            reply: data.reply,
            type: data.type,
            data: data.data,
            suggested_place_name: data.suggested_place_name,
            refined_query: data.refined_query
        });

    } catch (err) {
        console.error("Error in sendChatMessage:", err);
        res.status(500).json({
            error: "CHAT_ERROR",
            message: err.message
        });
    }
}

async function healthCheck(req, res) {
    try {
        // You can implement this to call your ML backend /health if needed
        res.json({ status: "ok" });
    } catch (err) {
        res.status(503).json({ status: "error", message: err.message });
    }
}

module.exports = {
    sendChatMessage,
    healthCheck
};