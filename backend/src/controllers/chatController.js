const { v4: uuidv4 } = require("uuid");
const { getSession, updateSession } = require("../store/sessionStore");

// WanderAI LLM backend URL (FastAPI service)
const WANDERAI_BACKEND_URL = process.env.WANDERAI_BACKEND_URL || "http://localhost:8000";
const CHAT_ENDPOINT = `${WANDERAI_BACKEND_URL}/v1/chat`;
const HEALTH_ENDPOINT = `${WANDERAI_BACKEND_URL}/v1/health`;

const MAX_HISTORY = 20; // prevent unlimited growth

async function sendChatMessage(req, res) {
    try {
        const { message, sessionId } = req.body;

        if (!message) {
            return res.status(400).json({
                ok: false,
                error: "Message is required"
            });
        }

        // Get or create session
        const id = sessionId || uuidv4();
        const session = await getSession(id, req.user.id);

        // Ensure fields exist
        session.history = session.history || [];
        session.suggested_places = session.suggested_places || [];

        if (!session.title) {
            await updateSession(id, req.user.id, {
                title: message.slice(0, 50)
            });
            session.title = message.slice(0, 50);
        }

        // 🔹 Prepare payload for WanderAI
        const payload = {
            message,
            session_id: id,
            user_id: req.user.id
        };

        console.log("📤 Calling WanderAI at:", CHAT_ENDPOINT);
        console.log("📝 Payload:", JSON.stringify(payload, null, 2));

        // 🔹 Call WanderAI backend
        const mlResponse = await fetch(CHAT_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!mlResponse.ok) {
            throw new Error(`WanderAI backend error: ${mlResponse.status}`);
        }

        const wanderaiData = await mlResponse.json();
        console.log("📥 WanderAI response:", JSON.stringify(wanderaiData, null, 2));

        // 🔹 Update session history with user message and bot response
        session.history.push({ role: "user", content: message });
        session.history.push({
            role: "assistant",
            content: wanderaiData.response || wanderaiData.reply || ""
        });

        // 🔹 Trim history to last N messages
        if (session.history.length > MAX_HISTORY) {
            session.history = session.history.slice(-MAX_HISTORY);
        }

        // 🔹 Extract and store suggested places from WanderAI response
        if (wanderaiData.data && wanderaiData.data.destinations) {
            const destinations = Array.isArray(wanderaiData.data.destinations)
                ? wanderaiData.data.destinations
                : [wanderaiData.data.destinations];

            destinations.forEach(dest => {
                const placeName = dest.name || dest;
                if (placeName && !session.suggested_places.includes(placeName)) {
                    session.suggested_places.push(placeName);
                }
            });
        }

        // 🔹 Keep only last N suggested places
        if (session.suggested_places.length > 50) {
            session.suggested_places = session.suggested_places.slice(-50);
        }

        // 🔹 Persist updated session to Supabase
        await updateSession(id, req.user.id, {
            history: session.history,
            suggested_places: session.suggested_places
        });

        // 🔹 Return response to frontend
        res.json({
            ok: true,
            sessionId: id,
            response: wanderaiData.response,
            reply: wanderaiData.response,
            data: wanderaiData.data || {},
            module_used: wanderaiData.module_used,
            suggested_places: session.suggested_places
        });

    } catch (err) {
        console.error("❌ Error in sendChatMessage:", err.message);

        res.status(500).json({
            ok: false,
            error: "CHAT_ERROR",
            message: err.message
        });
    }
}

async function healthCheck(req, res) {
    try {
        console.log("🏥 Checking WanderAI health at:", HEALTH_ENDPOINT);

        const response = await fetch(HEALTH_ENDPOINT, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            return res.status(503).json({
                ok: false,
                status: "unavailable",
                message: `WanderAI returned status ${response.status}`
            });
        }

        const data = await response.json();
        console.log("✅ WanderAI health check passed");

        res.json({
            ok: true,
            status: data.status || "ok",
            wanderai: data
        });
    } catch (err) {
        console.error("❌ Health check failed:", err.message);
        res.status(503).json({
            ok: false,
            status: "error",
            message: err.message
        });
    }
}

module.exports = {
    sendChatMessage,
    healthCheck
};