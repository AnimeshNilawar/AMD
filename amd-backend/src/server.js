require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const locationRoutes = require("./routes/locationRoutes");
const placesRoutes = require("./routes/placesRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const { supabase } = require("./services/supabaseClient");

const app = express();
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`\n📨 ${req.method} ${req.path}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log("Request body:", JSON.stringify(req.body, null, 2));
    }

    // Log response
    const originalJson = res.json;
    res.json = function (data) {
        console.log("✅ Response:", JSON.stringify(data, null, 2));
        return originalJson.call(this, data);
    };

    next();
});

app.use("/auth", authRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

app.get("/health", (req, res) => {
    res.json({ ok: true, message: "Server is up" });
});

app.get("/health/supabase", async (req, res) => {
    try {
        const { data, error } = await supabase.storage.listBuckets();

        if (error) {
            return res.status(500).json({
                ok: false,
                error: error.message
            });
        }

        return res.json({
            ok: true,
            buckets: data
        });
    } catch (err) {
        return res.status(500).json({
            ok: false,
            error: err.message
        });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
