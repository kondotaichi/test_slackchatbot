from pydantic import BaseModel

# 入力スキーマ
class ChatRequest(BaseModel):
    message: str

# 出力スキーマ
class ChatResponse(BaseModel):
    user_message: str
    gemini_response: str
