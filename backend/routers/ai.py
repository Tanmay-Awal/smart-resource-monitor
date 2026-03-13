from fastapi import APIRouter
from pydantic import BaseModel
from services.ai_services import answer_chat, generate_daily_story

router = APIRouter(prefix="/ai", tags=["ai"])

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
def chat(req: ChatRequest):
    """Chat with AI assistant about system performance"""
    reply = answer_chat(req.message)
    return {"reply": reply, "message": req.message}

@router.get("/daily-story")
def daily_story():
    """Get AI-generated daily system performance story"""
    story = generate_daily_story()
    return {"story": story}
