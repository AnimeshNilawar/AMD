const { v4: uuidv4 } = require("uuid");
const { getSession, updateSession } = require("../store/sessionStore");
const {
    extractIntent,
    suggestDestinations,
    buildItinerary,
    checkHealth
} = require("../services/mlService");

/**
 * Helper: format itinerary JSON into readable text
 */
function formatItinerary(itinerary) {
    if (!itinerary || !itinerary.days) return "";

    let text = "";
    itinerary.days.forEach(day => {
        text += `\n📅 Day ${day.day}:\n`;
        day.schedule.forEach(slot => {
            text += `  - ${slot.activity}\n`;
        });
    });

    text += `\n💰 Estimated total cost: ₹${itinerary.total_estimated_cost || "TBD"}`;
    return text;
}

/**
 * Health check endpoint
 */
async function healthCheck(req, res) {
    try {
        const healthy = await checkHealth();
        res.json({ status: healthy ? "ok" : "unavailable" });
    } catch (err) {
        res.status(503).json({ status: "error", message: err.message });
    }
}

/**
 * Main chatbot endpoint
 */
async function sendChatMessage(req, res) {
    try {
        const { message, sessionId } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Use existing session or create new one
        const id = sessionId || uuidv4();
        const session = getSession(id) || { stage: "new", intent: null, destination: null, itinerary: null };

        let reply = "";

        // ===== STAGE 1: New user → extract intent + suggest destination =====
        if (session.stage === "new") {
            const intent = await extractIntent(message);
            const suggestions = await suggestDestinations(message);
            const bestDestination = suggestions.destinations[0];

            updateSession(id, {
                stage: "destination_suggested",
                intent,
                destination: bestDestination
            });

            reply = `🌍 Based on your plan, I suggest *${bestDestination.name}*.\n\nWould you like me to build a detailed itinerary?`;
        }

        // ===== STAGE 2: User confirms destination → build itinerary =====
        else if (session.stage === "destination_suggested") {
            const msg = message.toLowerCase();

            const affirmativeWords = ["yes", "yeah", "yep", "please", "pls", "sure", "ok", "okay", "go ahead", "build"];
            const negativeWords = ["no", "nah", "nope", "not now", "later"];

            const isAffirmative = affirmativeWords.some(word => msg.includes(word));
            const isNegative = negativeWords.some(word => msg.includes(word));

            if (isAffirmative) {
                const itinerary = await buildItinerary(session.intent.original_query, 0);

                updateSession(id, {
                    stage: "itinerary_built",
                    intent: session.intent,
                    destination: session.destination,
                    itinerary
                });

                reply = `✨ Here’s your complete itinerary:\n${formatItinerary(itinerary)}\n\nYou can also say things like "make it cheaper" or "change destination".`;
            } 
            else if (isNegative) {
                reply = "Okay, want to try a different destination or update your plan?";
            } 
            else {
                reply = "Please reply with something like 'yes' or 'no' to proceed.";
            }
        }

        // ===== STAGE 3: Itinerary already built → handle modifications =====
        else if (session.stage === "itinerary_built") {
            const msg = message.toLowerCase();

            // Handle budget modifications
            if (msg.includes("cheaper") || msg.includes("less budget")) {
                session.intent.budget = Math.floor(session.intent.budget * 0.8);
                const itinerary = await buildItinerary(session.intent.original_query, 0);
                updateSession(id, { itinerary });

                reply = `💰 Updated itinerary with cheaper budget:\n${formatItinerary(itinerary)}`;
            } 
            // Handle destination change (hardcoded quick demo)
            else if (msg.includes("change destination") || msg.includes("goa")) {
                session.destination.name = "Goa Beach"; // quick demo hack
                session.intent.destination = "Goa Beach";
                const itinerary = await buildItinerary(session.intent.original_query, 0);
                updateSession(id, { destination: session.destination, itinerary });

                reply = `🌴 Changed destination to Goa:\n${formatItinerary(itinerary)}`;
            } 
            // Handle duration change (example)
            else if (msg.includes("shorter") || msg.includes("1 day")) {
                session.intent.duration_days = 1;
                const itinerary = await buildItinerary(session.intent.original_query, 0);
                updateSession(id, { intent: session.intent, itinerary });

                reply = `⏱️ Updated itinerary for 1 day:\n${formatItinerary(itinerary)}`;
            } 
            else {
                reply = "Sorry, I didn't understand that. Try saying 'make it cheaper', 'change destination', or 'shorten to 1 day'.";
            }
        }

        // Return response
        res.json({ sessionId: id, reply, itinerary: session.itinerary || null });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "CHAT_ERROR", message: err.message });
    }
}

module.exports = {
    sendChatMessage,
    healthCheck
};