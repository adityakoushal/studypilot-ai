from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from agent import demo_plan, chat

app = FastAPI(title="StudyPilot AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

progress = {
    "sessions": 0,
    "minutes": 0,
    "questions": 0,
    "streak": 1,
}


class PlanRequest(BaseModel):
    subject: str = Field(min_length=1, max_length=80)
    topic: str = Field(min_length=1, max_length=120)
    goal: str = "Exam Prep"
    minutes: int = Field(default=45, ge=10, le=240)


class ChatRequest(BaseModel):
    message: str
    context: dict = {}


class ProgressRequest(BaseModel):
    minutes: int = Field(default=45, ge=0, le=240)
    questions: int = Field(default=0, ge=0, le=50)


@app.get("/api/health")
def health():
    return {"status": "ok", "agent": "StudyPilot AI"}


@app.post("/api/study-plan")
def study_plan(req: PlanRequest):
    progress["sessions"] += 1
    progress["minutes"] += req.minutes
    return demo_plan(req.subject, req.topic, req.goal, req.minutes)


@app.post("/api/chat")
def study_chat(req: ChatRequest):
    return {"reply": chat(req.message, req.context)}


@app.post("/api/stuck")
def stuck(req: ChatRequest):
    return {"reply": chat(req.message, req.context)}


@app.post("/api/progress")
def update_progress(req: ProgressRequest):
    progress["minutes"] += req.minutes
    progress["questions"] += req.questions
    return progress


@app.get("/api/progress")
def get_progress():
    return progress
