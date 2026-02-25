# 🛠️ WanderAI: Backend Integration Guide

This guide is for the developer responsible for integrating the WanderAI Journey Engine into the backend (FastAPI, Express, Node.js, etc.).

## 📋 Important Files
To get the chatbot running, you need the following files from this repository:

| Content | Paths | Description |
| :--- | :--- | :--- |
| **Core Modules** | `modules/m0...m6.py` | The actual LLM logic and agents. |
| **Engine** | `modules/chatbot_engine.py` | The main class that coordinates the conversational flow. |
| **Utilities** | `utils/` | LLM client (Groq/Gemini) and RAG engine. |
| **Data** | `knowledge_base/` | JSON files containing the destination data. |
| **Config** | `config.py`, `.env` | Environment variables and API keys. |

## 🏗️ Recommended API Architecture

The system is designed to be **stateless**. The backend should maintain the session state (conversation history) and pass it to the `WanderAIChatbot` for each request.

### 1. Python LLM Service (`POST /api/chat`)

You will run a **Python FastAPI service** (this repo) and call it from your backend (Node, Express, etc.) over HTTP.

#### 1.1. Start the Python API

From the project root:

```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt

uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

This serves:

- `GET /health` – health-check
- `POST /api/chat` – main chat endpoint

#### 1.2. Request Body (what your Node backend sends)

```json
{
  "message": "any other beach?",
  "history": [
    { "role": "User", "content": "I want to go to a beach." },
    { "role": "Bot", "content": "Based on our chat, I suggest Alibaug Beach! ..." }
  ],
  "suggested_places": ["Alibaug Beach"]
}
```

- **`message`**: latest user message.
- **`history`**: conversation turns so the engine understands context.
- **`suggested_places`**: names of places already suggested (to avoid repeats).

#### 1.3. Response Shape

```json
{
  "reply": "Based on our chat, I suggest **Kashid Beach**! ...",
  "type": "suggestion",
  "data": {
    "name": "Kashid Beach",
    "category": "beach",
    "match_score": 92,
    "reasoning": "...",
    "estimated_cost": "1500",
    "distance": "130 km",
    "highlights": ["clean beach", "water sports"],
    "best_for": ["friends", "couples"]
  },
  "suggested_place_name": "Kashid Beach",
  "refined_query": "Search for NEW beach alternatives other than Alibaug."
}
```

- **`reply`**: text you show directly to the end-user.
- **`type`**: `"suggestion"` or `"itinerary"`.
- **`data`**:
  - For `"suggestion"` → a single destination object.
  - For `"itinerary"` → a full itinerary object with `destination`, `duration`, `days`, etc.
- **`suggested_place_name`**: push this into your session `suggested_places`.
- **`refined_query`**: optional debugging/analytics field from M0.

#### 1.4. Example: Node/Express Integration

```ts
// In your Node backend (TypeScript/JavaScript)
import fetch from "node-fetch";

async function callWanderAI(message, history, suggestedPlaces) {
  const res = await fetch("http://localhost:8000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      history,
      suggested_places: suggestedPlaces,
    }),
  });

  if (!res.ok) {
    throw new Error(`WanderAI error: ${res.status}`);
  }

  const data = await res.json();
  // data.reply -> show to user
  // data.type  -> "suggestion" | "itinerary"
  // data.data  -> destination or itinerary
  // data.suggested_place_name -> push into session
  return data;
}
```

## 🧠 State Management Tips
- **History Tracking**: The `history` list is crucial for M0 (Query Refiner) to resolve context like "any other?".
- **Suggested Places**: For the best UX, keep a list of `suggested_places` in the user's session so the bot doesn't repeat itself when the user says "show me more".

## 🚀 Environment Setup
Ensure the backend server has the `requirements.txt` installed and the `.env` file contains valid keys for `GROQ_API_KEY` and `GEMINI_API_KEY`.
