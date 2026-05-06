from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()

class TrainingDataItem(BaseModel):
    question: str
    answer: str
    confidence_score: float
    grammar_score: float
    technical_score: float
    overall_score: float
    feedback: str

@router.post("/train-local-model")
async def train_local_model(training_data: List[TrainingDataItem]):
    """Train the local ML model with provided training data"""
    try:
        from services.ml_trainer import MLTrainer
        
        trainer = MLTrainer()
        model_path = trainer.train(training_data)
        
        return {
            "status": "success",
            "message": "Model trained successfully",
            "model_path": model_path,
            "samples_used": len(training_data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/model-status")
async def get_model_status():
    """Get status of available models"""
    import os
    
    local_model_path = "./ml_model/models/feedback_model.pkl"
    
    return {
        "openai_api": {
            "available": True,
            "model": "gpt-4"
        },
        "local_model": {
            "available": os.path.exists(local_model_path),
            "path": local_model_path
        }
    }
