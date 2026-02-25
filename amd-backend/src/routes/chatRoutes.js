const express = require("express");
const { sendChatMessage, healthCheck } = require("../controllers/chatController");

const router = express.Router();

router.get("/health", async (req, res) => {
    try {
        const isHealthy = await healthCheck();
        res.json({ status: isHealthy ? "ok" : "unavailable" });
    } catch (err) {
        res.status(503).json({ status: "error", message: err.message });
    }
});

// ONLY public endpoint
router.post("/", sendChatMessage);

module.exports = router;




// const express = require("express");
// const {
//     sendChatMessage,
//     extractIntent,
//     suggestDestinations,
//     buildItinerary,
//     healthCheck
// } = require("../controllers/chatController");

// const router = express.Router();

// // Health check endpoint
// router.get("/health", async (req, res) => {
//     try {
//         const isHealthy = await healthCheck();
//         res.json({
//             status: isHealthy ? "ok" : "unavailable"
//         });
//     } catch (err) {
//         res.status(503).json({
//             status: "error",
//             message: err.message
//         });
//     }
// });

// // Smart chat endpoint - auto-routes to appropriate Python endpoint
// router.post("/", sendChatMessage);

// // Direct intent extraction endpoint
// router.post("/intent", async (req, res) => {
//     try {
//         const { query } = req.body;
//         if (!query) {
//             return res.status(400).json({
//                 error: "MISSING_QUERY",
//                 message: "query parameter is required"
//             });
//         }
//         const result = await extractIntent(query);
//         res.json(result);
//     } catch (err) {
//         res.status(503).json({
//             error: "INTENT_EXTRACTION_ERROR",
//             message: err.message
//         });
//     }
// });

// // Destination suggestion endpoint
// router.post("/suggest", async (req, res) => {
//     try {
//         const { query, top_k = 3 } = req.body;
//         if (!query) {
//             return res.status(400).json({
//                 error: "MISSING_QUERY",
//                 message: "query parameter is required"
//             });
//         }
//         const result = await suggestDestinations(query, top_k);
//         res.json(result);
//     } catch (err) {
//         res.status(503).json({
//             error: "DESTINATION_SUGGESTION_ERROR",
//             message: err.message
//         });
//     }
// });

// // Itinerary building endpoint
// router.post("/itinerary", async (req, res) => {
//     try {
//         const { query, destination_index = 0, top_k = 3 } = req.body;
//         if (!query) {
//             return res.status(400).json({
//                 error: "MISSING_QUERY",
//                 message: "query parameter is required"
//             });
//         }
//         const result = await buildItinerary(query, destination_index, top_k);
//         res.json(result);
//     } catch (err) {
//         res.status(503).json({
//             error: "ITINERARY_BUILDING_ERROR",
//             message: err.message
//         });
//     }
// });

// module.exports = router;
