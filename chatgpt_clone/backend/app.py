from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from models import ChatMessage, SessionLocal, init_db
from schemas import ChatRequest, ChatResponse
import google.generativeai as genai
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyAfF__vPRiCk2OU2CXR8A6c_GDOPQ5HLiY")
genai.configure(api_key=GEMINI_API_KEY)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(request.message)
    gemini_response = response.text if response else "エラー: 応答を取得できませんでした"

    chat = ChatMessage(user_message=request.message, gemini_response=gemini_response)
    db.add(chat)
    db.commit()
    db.refresh(chat)

    return {"user_message": chat.user_message, "gemini_response": chat.gemini_response}

@app.get("/history")
def get_history(db: Session = Depends(get_db)):
    messages = db.query(ChatMessage).all()
    return [{"user_message": msg.user_message, "gemini_response": msg.gemini_response} for msg in messages]