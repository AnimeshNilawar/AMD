// Mock data for places
const places = [
    {
        id: "rajmachi",
        name: "Rajmachi Trek",
        emoji: "🥾",
        bg: "forest",
        category: "Trekking",
        tags: ["Trekking", "Nature", "Beginner-Friendly"],
        crowd_level: "low",
        experience_score: 91,
        distance_km: 60,
        drive_time: "1.5h",
        price_label: "₹500",
        ai_description: "Rajmachi is one of the most rewarding weekend treks near Pune — a hidden gem that rewards early risers with sweeping views of the Sahyadri range...",
        scores: {
            popularity: 78,
            weather_bonus: 92,
            crowd_penalty: 12,
            user_affinity: 85
        },
        crowd_timeline: {
            hours: [
                { time: "6A", value: 10, is_best_window: false },
                { time: "7A", value: 8, is_best_window: true },
                { time: "8A", value: 12, is_best_window: true },
                { time: "9A", value: 25, is_best_window: false },
                { time: "10A", value: 40, is_best_window: false },
                { time: "11A", value: 55, is_best_window: false },
                { time: "12P", value: 60, is_best_window: false },
                { time: "1P", value: 45, is_best_window: false },
                { time: "2P", value: 35, is_best_window: false },
                { time: "3P", value: 28, is_best_window: false },
                { time: "4P", value: 20, is_best_window: false },
                { time: "5P", value: 15, is_best_window: false },
                { time: "6P", value: 12, is_best_window: false },
                { time: "7P", value: 10, is_best_window: false },
                { time: "8P", value: 8, is_best_window: false },
                { time: "9P", value: 6, is_best_window: false }
            ],
            best_window: "7 AM – 9 AM"
        },
        nearby: [
            { type: "food", emoji: "🍽️", name: "Rajmachi Homestay", distance_label: "0.2 km" },
            { type: "food", emoji: "🍵", name: "Village Tea Stall", distance_label: "0.5 km" },
            { type: "hotel", emoji: "🏡", name: "Aayush Homestay", distance_label: "1 km" },
            { type: "hotel", emoji: "⛺", name: "Forest Camp", distance_label: "2 km" }
        ],
        teams: [
            {
                teamId: "t1",
                name: "Pune Wanderers",
                memberCount: 5,
                date: "Sat 5:30 AM",
                spotsLeft: 2
            },
            {
                teamId: "t2",
                name: "Solo Trekkers Club",
                memberCount: 3,
                date: "Flexible timing",
                spotsLeft: 3
            }
        ],
        similar: [
            { id: "harishchandragad", name: "Harishchandragad", emoji: "🌄", category: "mtn", crowd_level: "low" },
            { id: "visapur", name: "Visapur Fort", emoji: "🏰", category: "forest", crowd_level: "low" },
            { id: "bhimashankar", name: "Bhimashankar", emoji: "🌳", category: "forest", crowd_level: "low" }
        ],
        itinerary: "🗓️ <b>Rajmachi Day Plan</b><br><br><b>6:30 AM</b> — Depart Pune (avoid traffic)<br><b>8:00 AM</b> — Arrive trailhead. Crowd: 🟢 Low (index 12)<br><b>8:15 AM</b> — Start trek (~3h, moderate difficulty)<br><b>11:30 AM</b> — Summit! Pack lunch here 🎒<br><b>1:00 PM</b> — Descend. Crowd rises to 🟡 45<br><b>2:30 PM</b> — Village homestay lunch (₹150)<br><b>4:30 PM</b> — Head back. Arrive Pune 6:30 PM<br><br><i>Why 8 AM? Crowd drops from 55 to 12 — you'll have the summit almost to yourself.</i>"
    },
    {
        id: "sinhagad",
        name: "Sinhagad Fort",
        emoji: "⛰️",
        bg: "mtn",
        category: "Mountains",
        tags: ["Fort", "History", "Trek"],
        crowd_level: "med",
        experience_score: 78,
        distance_km: 30,
        drive_time: "45 min",
        price_label: "Free",
        ai_description: "Historic mountain fort with panoramic views of the Pune valley...",
        scores: {
            popularity: 85,
            weather_bonus: 88,
            crowd_penalty: 35,
            user_affinity: 72
        },
        crowd_timeline: {
            hours: [
                { time: "6A", value: 15, is_best_window: false },
                { time: "7A", value: 18, is_best_window: true },
                { time: "8A", value: 22, is_best_window: true }
            ],
            best_window: "7 AM – 8 AM"
        },
        nearby: [
            { type: "food", emoji: "🍽️", name: "Fort Cafe", distance_label: "0.1 km" },
            { type: "hotel", emoji: "🏨", name: "Hillside Resort", distance_label: "1.5 km" }
        ],
        teams: [
            { teamId: "t3", name: "Weekend Warriors", memberCount: 8, date: "Sun 6 AM", spotsLeft: 1 }
        ],
        similar: [
            { id: "rajmachi", name: "Rajmachi Trek", emoji: "🥾", category: "forest", crowd_level: "low" }
        ],
        itinerary: "🗓️ <b>Sinhagad Day Plan</b><br><b>6:00 AM</b> — Start from Pune<br><b>7:00 AM</b> — Reach parking lot<br><b>7:30 AM</b> — Begin trek<br><b>9:30 AM</b> — Reach fort summit<br><b>11:00 AM</b> — Start descent"
    },
    {
        id: "alibaug",
        name: "Alibaug Beach",
        emoji: "🏖️",
        bg: "beach",
        category: "Beaches",
        tags: ["Beach", "Coastal", "Relaxing"],
        crowd_level: "high",
        experience_score: 82,
        distance_km: 96,
        drive_time: "2.5h",
        price_label: "Free",
        ai_description: "Popular coastal retreat for beach lovers and water sports enthusiasts...",
        scores: {
            popularity: 95,
            weather_bonus: 85,
            crowd_penalty: 50,
            user_affinity: 80
        },
        crowd_timeline: {
            hours: [
                { time: "6A", value: 5, is_best_window: true },
                { time: "7A", value: 8, is_best_window: true },
                { time: "8A", value: 15, is_best_window: false }
            ],
            best_window: "6 AM – 7 AM"
        },
        nearby: [
            { type: "food", emoji: "🍽️", name: "Beachside Restaurant", distance_label: "0.3 km" },
            { type: "hotel", emoji: "🏨", name: "Beach Resort", distance_label: "0.5 km" }
        ],
        teams: [
            { teamId: "t4", name: "Beach Bums", memberCount: 6, date: "Sat all day", spotsLeft: 4 }
        ],
        similar: [
            { id: "karla", name: "Karla Caves", emoji: "🕌", category: "cave", crowd_level: "med" }
        ],
        itinerary: "🗓️ <b>Alibaug Day Plan</b><br><b>7:00 AM</b> — Depart Pune<br><b>9:30 AM</b> — Arrive Alibaug<br><b>10:00 AM</b> — Beach time<br><b>1:00 PM</b> — Lunch"
    },
    {
        id: "karla",
        name: "Karla Caves",
        emoji: "🕌",
        bg: "cave",
        category: "Temples",
        tags: ["Cave", "Heritage", "Photography"],
        crowd_level: "med",
        experience_score: 88,
        distance_km: 58,
        drive_time: "1.5h",
        price_label: "Free",
        ai_description: "Ancient Buddhist caves with intricate rock-cut architecture...",
        scores: {
            popularity: 80,
            weather_bonus: 90,
            crowd_penalty: 25,
            user_affinity: 88
        },
        crowd_timeline: {
            hours: [
                { time: "6A", value: 12, is_best_window: false },
                { time: "7A", value: 15, is_best_window: true },
                { time: "8A", value: 20, is_best_window: true }
            ],
            best_window: "7 AM – 9 AM"
        },
        nearby: [
            { type: "food", emoji: "🍽️", name: "Village Meal", distance_label: "1 km" },
            { type: "hotel", emoji: "🏨", name: "Local Homestay", distance_label: "2 km" }
        ],
        teams: [
            { teamId: "t5", name: "History Enthusiasts", memberCount: 4, date: "Sun 8 AM", spotsLeft: 2 }
        ],
        similar: [
            { id: "bhimashankar", name: "Bhimashankar", emoji: "🌳", category: "forest", crowd_level: "low" }
        ],
        itinerary: "🗓️ <b>Karla Caves Day Plan</b><br><b>7:00 AM</b> — Depart<br><b>8:30 AM</b> — Explore caves"
    }
];

module.exports = { places };
