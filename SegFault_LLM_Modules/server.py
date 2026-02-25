"""
WanderAI HTTP API Server (FastAPI)

This exposes a simple /api/chat endpoint that any backend (Node, Python, etc.)
can call over HTTP.
"""

from typing import List, Dict, Optional

from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv

from modules.chatbot_engine import WanderAIChatbotEngine


# Load environment variables (.env with GROQ_API_KEY / GEMINI_API_KEY, etc.)
load_dotenv()

app = FastAPI(title="WanderAI API", version="1.0.0")

# Single shared engine instance (stateless; you pass history each request)
engine = WanderAIChatbotEngine()


class HistoryItem(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: List[HistoryItem] = []
    suggested_places: Optional[List[str]] = []


class ChatResponse(BaseModel):
    reply: str
    type: str
    data: Dict
    suggested_place_name: Optional[str] = None
    refined_query: Optional[str] = None


@app.get("/health")
async def health_check() -> Dict[str, str]:
    """Simple health-check endpoint."""
    return {"status": "ok"}


@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest) -> ChatResponse:
    """
    Main chat API.

    - message: current user message
    - history: full or partial conversation history as [{ role, content }]
    - suggested_places: list of place names already suggested to this user
    """
    # Convert HistoryItem models to plain dicts expected by the engine
    history_dicts: List[Dict[str, str]] = [
        {"role": item.role, "content": item.content} for item in request.history
    ]

    result = engine.process_message(
        user_input=request.message,
        history=history_dicts,
        suggested_places=request.suggested_places or [],
    )

    return ChatResponse(
        reply=result["response"],
        type=result["type"],
        data=result["data"],
        suggested_place_name=result.get("suggested_place_name"),
        refined_query=result.get("refined_query"),
    )


# To run locally:
#   uvicorn server:app --reload --host 0.0.0.0 --port 8000

