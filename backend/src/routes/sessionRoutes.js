const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
    listSessions,
    updateSessionTitle,
    deleteSession
} = require("../controllers/sessionController");

const router = express.Router();

// All session routes require authentication
router.use(authMiddleware);

// Get all sessions for a user
router.get("/", listSessions);

// Update session title
router.put("/:id/title", updateSessionTitle);

// Delete a session
router.delete("/:id", deleteSession);

module.exports = router;
