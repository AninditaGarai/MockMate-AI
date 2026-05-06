from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
import models
from services.feedback_evaluator import FeedbackEvaluator
from services.ml_evaluator import MLEvaluator
from typing import Optional

router = APIRouter()

class EvaluateAnswerRequest(BaseModel):
    interview_id: int
    question_id: int
    answer_text: Optional[str] = None
    use_ml_model: bool = False

class FeedbackResponse(BaseModel):
    confidence_score: float
    grammar_score: float
    technical_score: float
    overall_score: float
    feedback: str
    model_used: str

@router.post("/evaluate")
async def evaluate_answer(
    request: EvaluateAnswerRequest,
    db: Session = Depends(get_db)
):
    """Evaluate a user's answer and provide feedback"""
    try:
        # Get the question and interview
        question = db.query(models.Question).filter(
            models.Question.id == request.question_id
        ).first()
        
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
        
        # Evaluate using AI or ML model
        if request.use_ml_model:
            evaluator = MLEvaluator()
        else:
            evaluator = FeedbackEvaluator()
        
        evaluation = evaluator.evaluate(
            question=question.text,
            answer=request.answer_text
        )
        
        # Save to database
        interview_question = db.query(models.InterviewQuestion).filter(
            models.InterviewQuestion.interview_id == request.interview_id,
            models.InterviewQuestion.question_id == request.question_id
        ).first()
        
        if interview_question:
            interview_question.answer_text = request.answer_text
            interview_question.confidence_score = evaluation["confidence_score"]
            interview_question.grammar_score = evaluation["grammar_score"]
            interview_question.technical_score = evaluation["technical_score"]
            interview_question.overall_score = evaluation["overall_score"]
            interview_question.feedback = evaluation["feedback"]
            db.commit()
        
        return {
            **evaluation,
            "model_used": "ml_model" if request.use_ml_model else "openai"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/evaluate-voice")
async def evaluate_voice_answer(
    interview_id: int,
    question_id: int,
    audio_file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Evaluate a voice answer using speech-to-text and feedback evaluation"""
    try:
        from services.speech_to_text import transcribe_audio
        
        # Save audio file temporarily
        import tempfile
        import os
        
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            contents = await audio_file.read()
            tmp.write(contents)
            tmp_path = tmp.name
        
        # Transcribe audio
        answer_text = transcribe_audio(tmp_path)
        
        # Evaluate the transcribed text
        question = db.query(models.Question).filter(
            models.Question.id == question_id
        ).first()
        
        evaluator = FeedbackEvaluator()
        evaluation = evaluator.evaluate(
            question=question.text,
            answer=answer_text
        )
        
        # Clean up
        os.unlink(tmp_path)
        
        return {
            **evaluation,
            "transcribed_text": answer_text,
            "model_used": "openai"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history/{interview_id}")
async def get_feedback_history(
    interview_id: int,
    db: Session = Depends(get_db)
):
    """Get all feedback for an interview"""
    interview_questions = db.query(models.InterviewQuestion).filter(
        models.InterviewQuestion.interview_id == interview_id
    ).all()
    
    if not interview_questions:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    return [
        {
            "question_id": iq.question_id,
            "answer": iq.answer_text,
            "confidence_score": iq.confidence_score,
            "grammar_score": iq.grammar_score,
            "technical_score": iq.technical_score,
            "overall_score": iq.overall_score,
            "feedback": iq.feedback
        }
        for iq in interview_questions
    ]
