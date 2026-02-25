# WanderAI Backend - Debug & Setup Guide

## 🔧 Quick Setup

### 1. Configure Python LLM URL

Your Node server is on **port 5000**. Your Python service should be configured in `.env`:

```bash
# .env
PORT=5000
PYTHON_LLM_URL=http://localhost:8000
```

If your Python service is on a different port, update `PYTHON_LLM_URL` accordingly.

---

## ✅ Testing the Integration

### Step 1: Start the Node Server

```bash
npm run dev
```

Console output should show:

```
Server listening on port 5000
🌱 Starting database seeding...
```

With request logging enabled:

```
📨 POST /api/chat/health
✅ Response: { "status": "ok" }
```

### Step 2: Check Python LLM Service Health

```bash
curl http://localhost:5000/api/chat/health
```

Expected response:

```json
{
  "status": "ok"
}
```

**If you get "unavailable"**: Your Python service is not running on the configured URL.

---

## 📡 Test All Endpoints

### 1. Intent Extraction

```bash
curl -X POST http://localhost:5000/api/chat/intent \
  -H "Content-Type: application/json" \
  -d '{"query":"Trip to Alibaug for 2 people, budget 5000"}'
```

Expected response:

```json
{
  "budget": 5000,
  "group_size": 2,
  "duration_days": 2,
  ...
}
```

### 2. Destination Suggestions

```bash
curl -X POST http://localhost:5000/api/chat/suggest \
  -H "Content-Type: application/json" \
  -d '{"query":"beach trip budget 5000","top_k":3}'
```

Expected response:

```json
{
  "destinations": [
    {
      "name": "Alibaug Beach",
      "match_score": 92,
      ...
    }
  ],
  "summary": "...",
  "tips": [...]
}
```

### 3. Itinerary Building

```bash
curl -X POST http://localhost:5000/api/chat/itinerary \
  -H "Content-Type: application/json" \
  -d '{"query":"alibaug trip 2 days","destination_index":0,"top_k":3}'
```

Expected response:

```json
{
  "destination": "Alibaug Beach",
  "duration": 2,
  "days": [
    {
      "day": 1,
      "title": "Day Plan",
      "schedule": [...]
    }
  ],
  "total_estimated_cost": "₹2,400-3,000",
  ...
}
```

### 4. Smart Chat (Auto-Routing)

```bash
# Auto-detects keywords and routes to appropriate endpoint
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Plan my 2-day trip to Alibaug with 5k budget"}'
```

Response will include `type` field:

```json
{
  "type": "itinerary",
  "data": { ... }
}
```

---

## 🐛 Troubleshooting

### Issue: `503 LLM_SERVICE_ERROR`

**Cause**: Python service is not responding  
**Solution**:

1. Check Python service is running: `curl http://localhost:8000/health`
2. Verify `PYTHON_LLM_URL` in `.env` is correct
3. Check firewall/network connectivity

### Issue: Timeout Errors

**Cause**: Python service takes too long to respond  
**Solution**:

1. Increase timeout in [src/controllers/chatController.js](src/controllers/chatController.js)
2. Check Python service performance
3. Reduce `top_k` parameter (fewer destinations to generate)

### Issue: Empty or Malformed Response

**Cause**: Python service returning unexpected format  
**Solution**:

1. Test Python endpoint directly: `curl http://localhost:8000/intent/extract -d '{"query":"test"}'`
2. Ensure response contains required fields: `reply`, `destinations`, `itinerary`, etc.
3. Check Python service logs for errors

### Issue: Request Logging Not Showing

**Cause**: Logging middleware enabled in development  
**Solution**: Set `NODE_ENV=development` in `.env`

---

## 🔍 View Logs

Node console will show:

```
📨 POST /api/chat/itinerary
Request body: { "query": "...", "destination_index": 0, "top_k": 3 }
✅ Response: { "type": "itinerary", "data": { ... } }
```

---

## 📋 Port Configuration Summary

| Service      | Port | URL                                    |
| ------------ | ---- | -------------------------------------- |
| Node Backend | 5000 | `http://localhost:5000`                |
| Python LLM   | 8000 | `http://localhost:8000` (configurable) |

If your Python service is on a **different port**, update `.env`:

```bash
PYTHON_LLM_URL=http://localhost:YOUR_PORT
```

---

## ✨ Response Structure

All responses include a `type` field to help frontend route handling:

| Type           | Typical Fields                                                   |
| -------------- | ---------------------------------------------------------------- |
| `intent`       | `budget`, `group_size`, `duration_days`, `interests`, ...        |
| `destinations` | `destinations[]`, `summary`, `tips`                              |
| `itinerary`    | `destination`, `duration`, `days[]`, `total_estimated_cost`, ... |

---

## 🚀 Next Steps

1. Verify Python service is running and healthy
2. Test each endpoint individually with cURL
3. Check console logs for request/response details
4. Integrate with frontend using the response structure above

Happy debugging! 🎉
