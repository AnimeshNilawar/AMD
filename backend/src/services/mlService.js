const axios = require("axios");

const ML_BASE_URL = "http://localhost:8000";

async function extractIntent(query) {
    const res = await axios.post(`${ML_BASE_URL}/intent/extract`, {
        query
    });
    return res.data;
}

async function suggestDestinations(query) {
    const res = await axios.post(`${ML_BASE_URL}/destinations/suggest`, {
        query,
        top_k: 3
    });
    return res.data;
}

async function buildItinerary(query, destination_index = 0) {
    const res = await axios.post(`${ML_BASE_URL}/itinerary/build`, {
        query,
        destination_index
    });
    return res.data;
}

async function checkHealth() {
    const res = await axios.get(`${ML_BASE_URL}/health`);
    return res.data.status === "ok";
}

module.exports = {
    extractIntent,
    suggestDestinations,
    buildItinerary,
    checkHealth
};