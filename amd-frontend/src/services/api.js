// Mock API service — simulates backend responses
// Replace these with real API calls when backend is ready

import mockData from '../mock/places.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function getUserLocation() {
    await delay(200);
    return mockData.location;
}

export async function getPlaces({ category, sortBy } = {}) {
    await delay(300);
    let places = [...mockData.places];

    if (category && category !== 'All') {
        places = places.filter(p => p.category === category || p.tags?.includes(category));
    }

    if (sortBy === 'score') {
        places.sort((a, b) => b.experience_score - a.experience_score);
    } else if (sortBy === 'crowd') {
        const crowdOrder = { low: 0, med: 1, high: 2 };
        places.sort((a, b) => crowdOrder[a.crowd_level] - crowdOrder[b.crowd_level]);
    } else {
        // default: distance
        places.sort((a, b) => a.distance_km - b.distance_km);
    }

    return places;
}

export async function getPlaceById(id) {
    await delay(200);
    return mockData.places.find(p => p.id === id) || null;
}

export async function getTrendingPlaces() {
    await delay(200);
    return mockData.trending;
}

export async function getCrowdTimeline(placeId) {
    await delay(200);
    const place = mockData.places.find(p => p.id === placeId);
    return place?.crowd_timeline || null;
}

export async function getNearby(placeId) {
    await delay(100);
    const place = mockData.places.find(p => p.id === placeId);
    return place?.nearby || [];
}

export async function getTeams(placeId) {
    await delay(100);
    const place = mockData.places.find(p => p.id === placeId);
    return place?.teams || [];
}

export async function getSimilarPlaces(placeId) {
    await delay(100);
    const place = mockData.places.find(p => p.id === placeId);
    return place?.similar || [];
}

export async function getUserProfile() {
    await delay(200);
    return mockData.user;
}

export async function getUserHistory() {
    await delay(200);
    return mockData.user.history;
}

export async function getRecommendations() {
    await delay(200);
    return mockData.user.recommendations;
}

export async function getSimilarUserPlaces() {
    await delay(100);
    return mockData.user.similarUsers;
}

// Chat response logic
const CHAT_RESPONSES = [
    { trigger: 'beach', reply: "🏖️ For beaches near Pune: Alibaug (96 km, LOW crowd this weekend, ⭐87), Kashid (120 km), or Diveagar (130 km, very offbeat). Budget ₹1,500–₹2,500/person. Want a full plan?" },
    { trigger: 'trek', reply: "🥾 Top treks this weekend: Rajmachi (60 km, LOW crowd, ⭐91), Harishchandragad (130 km, ⭐93), Kalsubai (165 km, ⭐89). All have low crowd. Which one?" },
    { trigger: 'budget', reply: "💰 Under ₹2,000? Tamhini Falls (free) + Karla Caves (₹150) are both incredible — LOW crowd this Sunday. Want a combined itinerary?" },
    { trigger: 'crowd', reply: "🧘 Lowest crowd spots this weekend: Karla Caves (index: 15), Rajmachi Trek (index: 20), Tamhini Falls (index: 30). Best visited before 10 AM." },
    { trigger: 'group', reply: "👥 For groups, Rajmachi Trek is perfect — beginner-friendly, LOW crowd, and open group slots available. How many people?" },
    { trigger: 'solo', reply: "🎒 Solo trip! Karla Caves is perfect — LOW crowd, rich history, 3h experience. Total cost: ₹400. Leaving Sunday morning?" },
    { trigger: 'plan', reply: "🗓️ Tell me: (1) your dates, (2) group size, (3) budget/person, (4) what you love — nature, heritage, beach, or adventure?" },
    { trigger: 'hotel', reply: "🏨 Alibaug: beach resorts ₹2,500–₹4,000/night. Lonavala: ₹1,500–₹3,000/night. Rajmachi: charming homestays ₹800–₹1,200/night with meals. Which area?" },
    { trigger: 'food', reply: "🍜 Top picks: Kokan Darbar (Alibaug) for seafood, Summit Bhakri Stall at Sinhagad for local food, Ghat Dhaba near Tamhini for hot pakoras with valley views. 😋" },
];

const DEFAULT_REPLIES = [
    "Based on this weekend's crowd data, your best options are Karla Caves or Tamhini Falls — both LOW crowd and under 2h drive.",
    "Rajmachi Trek is ⭐91/100 and LOW crowd — perfect for this weekend. Want me to plan the full day?",
    "For a mix of history + nature, try Sinhagad Fort (morning) + Karla Caves (afternoon). Want a combined itinerary?",
];

let defaultIndex = 0;

export async function sendChatMessage({ message }) {
    await delay(700);
    const lower = message.toLowerCase();

    for (const cr of CHAT_RESPONSES) {
        if (lower.includes(cr.trigger)) {
            return { reply: cr.reply, suggestions: [] };
        }
    }

    const reply = DEFAULT_REPLIES[defaultIndex % DEFAULT_REPLIES.length];
    defaultIndex++;
    return { reply, suggestions: [] };
}

export async function generateItinerary(placeId) {
    await delay(500);
    const place = mockData.places.find(p => p.id === placeId);
    return { itinerary: place?.itinerary || 'No itinerary available for this place yet.' };
}
