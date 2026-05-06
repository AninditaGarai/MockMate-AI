from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    interviews = relationship("Interview", back_populates="user")
    performance_history = relationship("PerformanceHistory", back_populates="user")

class Interview(Base):
    __tablename__ = "interviews"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    interview_type = Column(String)  # SDE, AI/ML, HR
    difficulty = Column(String)  # easy, medium, hard
    score = Column(Float, nullable=True)
    duration = Column(Integer, nullable=True)  # in seconds
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="interviews")
    questions = relationship("InterviewQuestion", back_populates="interview")

class Question(Base):
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text)
    category = Column(String)  # SDE, AI/ML, HR
    difficulty = Column(String)  # easy, medium, hard
    tags = Column(String, nullable=True)  # comma-separated
    model_generated = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    interview_questions = relationship("InterviewQuestion", back_populates="question")

class InterviewQuestion(Base):
    __tablename__ = "interview_questions"
    
    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    answer_text = Column(Text, nullable=True)
    answer_audio_path = Column(String, nullable=True)
    confidence_score = Column(Float, nullable=True)
    grammar_score = Column(Float, nullable=True)
    technical_score = Column(Float, nullable=True)
    overall_score = Column(Float, nullable=True)
    feedback = Column(Text, nullable=True)
    answered_at = Column(DateTime, nullable=True)
    
    # Relationships
    interview = relationship("Interview", back_populates="questions")
    question = relationship("Question", back_populates="interview_questions")

class PerformanceHistory(Base):
    __tablename__ = "performance_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    category = Column(String)  # SDE, AI/ML, HR
    average_score = Column(Float)
    total_interviews = Column(Integer)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="performance_history")

class TrainingData(Base):
    __tablename__ = "training_data"
    
    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text)
    answer = Column(Text)
    confidence_score = Column(Float)
    grammar_score = Column(Float)
    technical_score = Column(Float)
    overall_score = Column(Float)
    feedback = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
