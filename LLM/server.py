"""
WanderAI HTTP API server for backend communication.

Run with: uvicorn server:app --host 0.0.0.0 --port 8000

Endpoints:
  POST /v1/chat   - Send a user message and get the assistant response.
  GET  /v1/health - Health check for load balancers.
  POST /v1/webhook - Ingest knowledge-base update webhooks (optional).
"""
import json
import logging
from typing import Optional

from fastapi import FastAPI, HTTPException, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from config import settings
from api_adapter import handle_message, get_core

logging.basicConfig(level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO))
logger = logging.getLogger(__name__)

app = FastAPI(
    title="WanderAI API",
    description="Travel-planning LLM engine API for chat and knowledge-base webhooks",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Request/Response models ---


class ChatRequest(BaseModel):
    """Request body for POST /v1/chat"""

    message: str = Field(..., min_length=1, description="User message text")
    session_id: Optional[str] = Field(None, description="Optional session ID for conversation continuity")


# --- Endpoints ---


@app.get("/")
async def root():
    """Redirect to API docs."""
    return {
        "service": "WanderAI API",
        "docs": "/docs",
        "health": f"/{settings.API_VERSION}/health",
        "chat": f"/{settings.API_VERSION}/chat",
    }


@app.get(f"/{settings.API_VERSION}/health")
async def health():
    """
    Health check. Use for load balancers and readiness probes.
    Does not call the LLM; only checks that the app is up and config is present.
    """
    has_groq = bool(settings.GROQ_API_KEY)
    has_gemini = bool(settings.GEMINI_API_KEY)
    return {
        "status": "ok",
        "primary_llm": settings.PRIMARY_LLM,
        "llm_configured": has_groq or has_gemini,
    }


@app.post(f"/{settings.API_VERSION}/chat")
async def chat(body: ChatRequest):
    """
    Process a user message and return the assistant response and structured data.

    Returns: response text, session_id, data (e.g. itinerary/suggestions),
    module_used, confidence, validation_status, etc.
    """
    try:
        result = handle_message(body.message, session_id=body.session_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.exception("Chat request failed")
        raise HTTPException(status_code=500, detail=str(e))


@app.post(f"/{settings.API_VERSION}/webhook")
async def webhook(
    request: Request,
    x_webhook_signature: Optional[str] = Header(None, alias="X-Webhook-Signature"),
):
    """
    Receive knowledge-base update webhooks.

    Expects JSON body with: action (add|update|delete), type (place|tip|category), data (object).
    If WEBHOOK_SECRET is set, X-Webhook-Signature header must contain HMAC-SHA256 of the body
    (sign the JSON string with sort_keys=True).
    """
    try:
        raw_body = await request.body()
        payload = json.loads(raw_body.decode("utf-8"))
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON: {e}")

    core = get_core()
    if not core.webhook_manager:
        raise HTTPException(status_code=503, detail="Webhook manager not available")

    signature = x_webhook_signature
    success, message = core.webhook_manager.process_webhook(payload, signature=signature)

    if not success:
        raise HTTPException(status_code=400, detail=message)

    return {"status": "ok", "message": message}


# --- Run with uvicorn ---

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "server:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=False,
    )
