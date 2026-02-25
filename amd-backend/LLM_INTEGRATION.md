# Node-to-Python LLM Integration

## ✅ What's Done

1. **axios** installed in `package.json`
2. **Chat controller** updated with smart routing to Python LLM endpoints
3. **Multiple endpoints** for different operations (intent extraction, destination suggestions, itinerary building)
4. **Error handling** with proper HTTP status codes

---

## 🚀 How to Use

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: (Optional) Set Python LLM URL

If your Python service is not on `localhost:8000`, set the environment variable:

```bash
# .env
PYTHON_LLM_URL=http://your-python-server:8000
```

### Step 3: Start Node Server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

### Step 4: Ensure Python LLM Service is Running

Your Python FastAPI service must be running on the configured URL with these endpoints:

- `GET /health` - Health check
- `POST /intent/extract` - Extract travel intent
- `POST /destinations/suggest` - Suggest destinations
- `POST /itinerary/build` - Build full itinerary

---

## 📡 API Endpoints

### Health Check

**`GET /api/chat/health`**

Checks if Python LLM service is available.

```bash
curl http://localhost:3000/api/chat/health
```

**Response:**

```json
{
  "status": "ok"
}
```

---

### Smart Chat (Auto-Routing)

**`POST /api/chat`**

Intelligently routes to the appropriate Python endpoint based on keywords in your message.

**Request:**

```json
{
  "message": "Plan a trip to Alibaug for 2 people with budget 5k"
}
```

**Response (Automatic Routing):**

- If message contains `itinerary`, `plan`, `day`, `schedule` → calls `/itinerary/build`
- If message contains `suggest`, `recommend`, `options`, `where` → calls `/destinations/suggest`
- Otherwise → calls `/intent/extract`

```json
{
  "type": "intent",
  "data": {
    "budget": 5000,
    "group_size": 2,
    "duration_days": 2,
    "interests": ["beach", "relaxing"],
    "crowd_preference": "low"
  }
}
```

---

### Intent Extraction

**`POST /api/chat/intent`**

Extracts structured travel intent from natural language.

**Request:**

```json
{
  "query": "Trip to Alibaug for 2 people, budget 5k"
}
```

**Response:**

```json
{
  "budget": 5000,
  "group_size": 2,
  "duration_days": 2,
  "start_date": "2025-02-28",
  "interests": ["beach", "relaxing"],
  "avoid_list": ["crowds"],
  "crowd_preference": "low",
  "accommodation_needed": true,
  "transport_mode": "car",
  "special_requirements": []
}
```

---

### Destination Suggestions

**`POST /api/chat/suggest`**

Suggests destinations based on travel intent using RAG + LLM.

**Request:**

```json
{
  "query": "Trip to Alibaug for 2 people, budget 5k",
  "top_k": 3
}
```

**Response:**

```json
{
  "destinations": [
    {
      "name": "Alibaug Beach",
      "category": "beach",
      "match_score": 92,
      "reasoning": "Matches your budget and preference for a relaxed beach trip.",
      "estimated_cost": 4500,
      "distance": "140 km",
      "highlights": ["Clean beach", "Water sports"],
      "best_for": ["friends", "weekend"]
    }
  ],
  "summary": "Here are some great options for a budget-friendly beach weekend.",
  "tips": ["Start early to avoid traffic", "Book in advance"]
}
```

---

### Itinerary Building

**`POST /api/chat/itinerary`**

Builds a detailed day-by-day itinerary for a chosen destination.

**Request:**

```json
{
  "query": "Trip to Alibaug for 2 people, budget 5k",
  "destination_index": 0,
  "top_k": 3
}
```

**Response:**

```json
{
  "destination": "Alibaug Beach",
  "duration": 2,
  "days": [
    {
      "day": 1,
      "title": "Arrival and Beach Time",
      "schedule": [
        {
          "time": "09:00 AM",
          "activity": "Drive from Pune to Alibaug",
          "location": "Pune → Alibaug",
          "duration": "3.5 hours",
          "cost": "Tolls + fuel",
          "tips": "Leave early to avoid traffic."
        }
      ],
      "meals": {
        "breakfast": "On the way",
        "lunch": "Beachside shack",
        "dinner": "Seafood restaurant"
      },
      "total_cost": 2500,
      "notes": "Carry sunscreen and extra water."
    }
  ],
  "total_estimated_cost": 5000,
  "packing_list": ["Sunscreen", "Cap", "Flip-flops"],
  "emergency_contacts": {
    "Local Police": "100",
    "Ambulance": "108"
  }
}
```

---

## 📝 Example Usage Flow

```
1. User asks: "Plan a 2-day trip to Alibaug for ₹5000"
   ↓
2. Frontend → POST /api/chat with message
   ↓
3. Node detects "Plan" keyword → routes to buildItinerary
   ↓
4. Node → POST to Python /itinerary/build
   ↓
5. Python returns itinerary JSON
   ↓
6. Frontend receives organized day-by-day plan
```

---

## 🔧 Configuration

**Python LLM Base URL** in [src/controllers/chatController.js](src/controllers/chatController.js):

```javascript
const PYTHON_LLM_BASE = process.env.PYTHON_LLM_URL || "http://localhost:8000";
```

Override with `.env`:

```
PYTHON_LLM_URL=http://your-server:8000
```

---

## ✋ Troubleshooting

| Issue                                       | Solution                                              |
| ------------------------------------------- | ----------------------------------------------------- |
| "ECONNREFUSED" on port 8000                 | Python service not running. Start it first.           |
| 503 Service Error                           | Check Python service is responsive at configured URL  |
| Timeout (> 30 seconds)                      | Optimize Python response time or increase timeout     |
| JSON parse error                            | Ensure Python returns valid JSON with expected fields |
| `POST /api/chat/health` returns unavailable | Python service down or wrong URL configured           |

---

## 🎯 Testing with cURL

```bash
# Test health
curl http://localhost:3000/api/chat/health

# Test smart chat (auto-routing)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"plan my trip to alibaug"}'

# Test intent extraction directly
curl -X POST http://localhost:3000/api/chat/intent \
  -H "Content-Type: application/json" \
  -d '{"query":"trip to alibaug for 2 people budget 5k"}'

# Test destination suggestions
curl -X POST http://localhost:3000/api/chat/suggest \
  -H "Content-Type: application/json" \
  -d '{"query":"beach trip near pune", "top_k": 3}'

# Test itinerary building
curl -X POST http://localhost:3000/api/chat/itinerary \
  -H "Content-Type: application/json" \
  -d '{"query":"alibaug trip 2 days budget 5k", "destination_index": 0}'
```

---

## 📊 Endpoint Summary

| Endpoint              | Method | Python Route            | Purpose               |
| --------------------- | ------ | ----------------------- | --------------------- |
| `/api/chat/health`    | GET    | `/health`               | Check Python service  |
| `/api/chat`           | POST   | Auto-routed             | Smart routing         |
| `/api/chat/intent`    | POST   | `/intent/extract`       | Extract travel intent |
| `/api/chat/suggest`   | POST   | `/destinations/suggest` | Suggest destinations  |
| `/api/chat/itinerary` | POST   | `/itinerary/build`      | Build itinerary       |

---

Ready to integrate! 🚀 Make sure your Python FastAPI service is running with all required endpoints.
