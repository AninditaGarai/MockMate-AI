from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
import models
from services.question_generator import QuestionGenerator
from typing import List

router = APIRouter()

class QuestionResponse(BaseModel):
    id: int
    text: str
    category: str
    difficulty: str
    tags: str = None
    
    class Config:
        from_attributes = True

class GenerateQuestionRequest(BaseModel):
    category: str  # SDE, AI/ML, HR
    difficulty: str  # easy, medium, hard
    count: int = 1

@router.post("/generate")
async def generate_questions(
    request: GenerateQuestionRequest,
    db: Session = Depends(get_db)
):
    """Generate interview questions using AI"""
    try:
        generator = QuestionGenerator()
        questions = generator.generate_questions(
            category=request.category,
            difficulty=request.difficulty,
            count=request.count
        )
        
        # Save to database
        db_questions = []
        for q in questions:
            db_question = models.Question(
                text=q["text"],
                category=request.category,
                difficulty=request.difficulty,
                tags=q.get("tags", ""),
                model_generated=True
            )
            db.add(db_question)
            db_questions.append(db_question)
        
        db.commit()
        return {"questions": db_questions, "generated_by": "openai"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/all", response_model=List[QuestionResponse])
async def get_all_questions(
    category: str = None,
    difficulty: str = None,
    db: Session = Depends(get_db)
):
    """Get all questions or filter by category/difficulty"""
    query = db.query(models.Question)
    
    if category:
        query = query.filter(models.Question.category == category)
    if difficulty:
        query = query.filter(models.Question.difficulty == difficulty)
    
    return query.all()

@router.get("/{question_id}")
async def get_question(question_id: int, db: Session = Depends(get_db)):
    """Get a specific question by ID"""
    question = db.query(models.Question).filter(
        models.Question.id == question_id
    ).first()
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    return question
