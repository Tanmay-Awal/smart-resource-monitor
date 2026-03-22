from fastapi import APIRouter, Depends, Query
from typing import Optional
from pydantic import BaseModel
from services.ai_services import answer_chat, generate_daily_story
from sqlalchemy.orm import Session
from database import get_db
from models.models import ChatMessage
import datetime

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str

@router.post("/ask")
def chat(req: ChatRequest, user_id: Optional[int] = Query(None), db: Session = Depends(get_db)):
    """Chat with AI assistant and save to DB"""
    reply = answer_chat(req.message)
    
    # Save user message
    user_msg = ChatMessage(
        user_id=user_id,
        sender="user",
        message=req.message
    )
    db.add(user_msg)
    
    # Save assistant message
    assistant_msg = ChatMessage(
        user_id=user_id,
        sender="assistant",
        message=reply
    )
    db.add(assistant_msg)
    db.commit()
    
    return {"response": reply, "message": req.message}

@router.get("/history")
def get_history(user_id: Optional[int] = Query(None), db: Session = Depends(get_db)):
    """Get chat history for a user"""
    if not user_id:
        return []
    
    history = db.query(ChatMessage).filter(ChatMessage.user_id == user_id).order_by(ChatMessage.timestamp.asc()).all()
    return history

@router.get("/daily-story")
def daily_story():
    """Get AI-generated daily system performance story"""
    story = generate_daily_story()
    return {"story": story}
