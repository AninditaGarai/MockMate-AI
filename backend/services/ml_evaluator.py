import pickle
import os
from typing import Dict, Any
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import json

class MLEvaluator:
    """Evaluate answers using locally trained ML model"""
    
    def __init__(self):
        self.model_path = "./ml_model/models/feedback_model.pkl"
        self.scaler_path = "./ml_model/models/scaler.pkl"
        self.model = None
        self.scaler = None
        self._load_model()
    
    def _load_model(self):
        """Load the trained ML model from disk"""
        try:
            if os.path.exists(self.model_path):
                with open(self.model_path, 'rb') as f:
                    self.model = pickle.load(f)
            
            if os.path.exists(self.scaler_path):
                with open(self.scaler_path, 'rb') as f:
                    self.scaler = pickle.load(f)
        except Exception as e:
            print(f"Error loading model: {e}")
    
    def evaluate(self, question: str, answer: str) -> Dict[str, Any]:
        """Evaluate an answer using the local ML model"""
        
        if not self.model:
            return self._fallback_evaluation(question, answer)
        
        try:
            # Extract features from answer
            features = self._extract_features(question, answer)
            
            # Scale features
            if self.scaler:
                features = self.scaler.transform([features])
            else:
                features = np.array([features])
            
            # Predict scores
            predictions = self.model.predict(features)[0]
            
            # Ensure scores are within 0-100 range
            scores = {
                "confidence_score": min(100, max(0, predictions[0])),
                "grammar_score": min(100, max(0, predictions[1])),
                "technical_score": min(100, max(0, predictions[2])),
                "overall_score": min(100, max(0, predictions[3]))
            }
            
            feedback = self._generate_feedback(scores, answer)
            scores["feedback"] = feedback
            
            return scores
        
        except Exception as e:
            print(f"Error in ML evaluation: {e}")
            return self._fallback_evaluation(question, answer)
    
    def _extract_features(self, question: str, answer: str) -> np.ndarray:
        """Extract numerical features from question and answer"""
        
        # Basic features
        answer_length = len(answer.split())
        question_length = len(question.split())
        
        # Sentiment/confidence indicators
        confident_words = ['definitely', 'certainly', 'absolutely', 'clearly', 'obviously']
        uncertain_words = ['maybe', 'perhaps', 'might', 'seems', 'possibly']
        
        confident_count = sum(1 for w in answer.lower().split() if w in confident_words)
        uncertain_count = sum(1 for w in answer.lower().split() if w in uncertain_words)
        
        # Complexity indicators
        long_words = sum(1 for w in answer.split() if len(w) > 8)
        technical_markers = answer.count('algorithm') + answer.count('data') + answer.count('system')
        
        # Create feature vector
        features = np.array([
            answer_length,
            question_length,
            confident_count,
            uncertain_count,
            long_words,
            technical_markers,
            answer.count('!'),
            answer.count('?')
        ])
        
        return features
    
    def _generate_feedback(self, scores: Dict, answer: str) -> str:
        """Generate feedback based on scores"""
        
        feedback_parts = []
        
        if scores['confidence_score'] < 50:
            feedback_parts.append("Try to express more confidence in your answer.")
        elif scores['confidence_score'] > 90:
            feedback_parts.append("Great confidence in your response!")
        
        if scores['grammar_score'] < 70:
            feedback_parts.append("Review grammar and sentence structure.")
        
        if scores['technical_score'] < 60:
            feedback_parts.append("Include more technical details and examples.")
        
        if scores['overall_score'] > 80:
            feedback_parts.append("Excellent overall response!")
        
        return " ".join(feedback_parts) if feedback_parts else "Good attempt. Keep practicing!"
    
    def _fallback_evaluation(self, question: str, answer: str) -> Dict[str, Any]:
        """Fallback evaluation when model is not available"""
        
        answer_length = len(answer.split())
        base_score = min(100, 30 + (answer_length // 5))
        
        return {
            "confidence_score": base_score,
            "grammar_score": base_score - 10,
            "technical_score": base_score - 15,
            "overall_score": (base_score + (base_score - 10) + (base_score - 15)) // 3,
            "feedback": "Using fallback evaluation. Train a custom model for better results."
        }
