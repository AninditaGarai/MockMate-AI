from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from security import get_current_user_id
import models
from datetime import datetime

router = APIRouter()

class InterviewStartRequest(BaseModel):
    interview_type: str  # SDE, AI/ML, HR
    difficulty: str  # easy, medium, hard

class PerformanceSummary(BaseModel):
    category: str
    average_score: float
    total_interviews: int

@router.post("/start-interview")
async def start_interview(
    request: InterviewStartRequest,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Start a new interview session"""
    # Create new interview
    interview = models.Interview(
        user_id=user_id,
        interview_type=request.interview_type,
        difficulty=request.difficulty
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)
    
    return {
        "interview_id": interview.id,
        "started_at": interview.started_at,
        "type": interview.interview_type,
        "difficulty": interview.difficulty
    }

@router.post("/end-interview/{interview_id}")
async def end_interview(
    interview_id: int,
    db: Session = Depends(get_db)
):
    """End an interview session and calculate score"""
    interview = db.query(models.Interview).filter(
        models.Interview.id == interview_id
    ).first()
    
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    # Calculate overall score
    questions = interview.questions
    if questions:
        total_score = sum(q.overall_score for q in questions if q.overall_score)
        average_score = total_score / len(questions)
        interview.score = average_score
    
    interview.completed_at = datetime.utcnow()
    db.commit()
    
    return {
        "interview_id": interview.id,
        "score": interview.score,
        "completed_at": interview.completed_at,
        "total_questions": len(questions)
    }

@router.get("/performance/{user_id}")
async def get_user_performance(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Get user's performance history"""
    performance = db.query(models.PerformanceHistory).filter(
        models.PerformanceHistory.user_id == user_id
    ).all()
    
    if not performance:
        raise HTTPException(status_code=404, detail="No performance history found")
    
    return performance

@router.get("/interviews/{user_id}")
async def get_user_interviews(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Get all interviews for a user"""
    interviews = db.query(models.Interview).filter(
        models.Interview.user_id == user_id
    ).all()
    
    return [
        {
            "id": i.id,
            "type": i.interview_type,
            "difficulty": i.difficulty,
            "score": i.score,
            "started_at": i.started_at,
            "completed_at": i.completed_at
        }
        for i in interviews
    ]
