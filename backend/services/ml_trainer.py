import pickle
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import os
from typing import List, Dict

class MLTrainer:
    """Train custom ML models for feedback evaluation"""
    
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.model_path = "./ml_model/models/feedback_model.pkl"
        self.scaler_path = "./ml_model/models/scaler.pkl"
        
        # Create directories if they don't exist
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
    
    def train(self, training_data: List[Dict]) -> str:
        """Train the model with provided training data"""
        
        # Extract features and labels
        X = []
        y = []
        
        for item in training_data:
            features = self._extract_features(item['question'], item['answer'])
            X.append(features)
            
            # Labels (scores)
            y.append([
                item['confidence_score'],
                item['grammar_score'],
                item['technical_score'],
                item['overall_score']
            ])
        
        X = np.array(X)
        y = np.array(y)
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train model
        self.model.fit(X_scaled, y)
        
        # Save model
        self._save_model()
        
        return self.model_path
    
    def _extract_features(self, question: str, answer: str) -> np.ndarray:
        """Extract numerical features from question and answer"""
        
        answer_length = len(answer.split())
        question_length = len(question.split())
        
        confident_words = ['definitely', 'certainly', 'absolutely', 'clearly', 'obviously']
        uncertain_words = ['maybe', 'perhaps', 'might', 'seems', 'possibly']
        
        confident_count = sum(1 for w in answer.lower().split() if w in confident_words)
        uncertain_count = sum(1 for w in answer.lower().split() if w in uncertain_words)
        
        long_words = sum(1 for w in answer.split() if len(w) > 8)
        technical_markers = answer.count('algorithm') + answer.count('data') + answer.count('system')
        
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
    
    def _save_model(self):
        """Save the trained model to disk"""
        with open(self.model_path, 'wb') as f:
            pickle.dump(self.model, f)
        
        with open(self.scaler_path, 'wb') as f:
            pickle.dump(self.scaler, f)
