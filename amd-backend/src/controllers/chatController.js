const { v4: uuidv4 } = require("uuid");
const { getSession, updateSession } = require("../store/sessionStore");

// Your ML backend URL (FastAPI service)
const ML_BACKEND_URL =
    process.env.ML_BACKEND_URL || "http://localhost:8000/api/chat";

const MAX_HISTORY = 20; // prevent unlimited growth

async function sendChatMessage(req, res) {
    try {
        const { message, sessionId } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Get or create session
        const id = sessionId || uuidv4();
        const session = await getSession(id, req.user.id);

        // Ensure fields exist
        session.history = session.history || [];
        session.suggested_places = session.suggested_places || [];

        if (!session.title) {
            await updateSession(id, req.user.id, {
                title: message.slice(0, 40)
            });
            session.title = message.slice(0, 40);
        }

        // 🔹 Prepare payload WITHOUT modifying history yet
        const payload = {
            message,
            history: session.history,
            suggested_places: session.suggested_places
        };

        // 🔹 Call ML backend
        const mlResponse = await fetch(ML_BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!mlResponse.ok) {
            throw new Error(`ML backend error: ${mlResponse.status}`);
        }

        const data = await mlResponse.json();

        // 🔹 Only update history AFTER successful ML response
        session.history.push({ role: "user", content: message });
        session.history.push({ role: "assistant", content: data.reply });

        // 🔹 Trim history to last N messages
        if (session.history.length > MAX_HISTORY) {
            session.history = session.history.slice(-MAX_HISTORY);
        }

        // 🔹 Prevent duplicate suggested places
        if (data.suggested_place_name) {
            if (!session.suggested_places.includes(data.suggested_place_name)) {
                session.suggested_places.push(data.suggested_place_name);
            }
        }

        // 🔹 Persist to Supabase
        await updateSession(id, req.user.id, {
            history: session.history,
            suggested_places: session.suggested_places
        });

        // 🔹 Send response back to frontend
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
        res.json({ status: "ok" });
    } catch (err) {
        res.status(503).json({ status: "error", message: err.message });
    }
}

module.exports = {
    sendChatMessage,
    healthCheck
};