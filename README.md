# AI Interview Simulator System

A full-stack web application designed to help users prepare for technical and non-technical interviews through an interactive, AI-driven experience.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## ⭐ Features

### 🎯 AI-Based Question Generation
- Dynamically generates interview questions across domains (SDE, AI/ML, HR)
- Supports multiple difficulty levels (easy, medium, hard)
- Adaptive questioning based on user performance

### 🎤 Multi-Modal Input (Text + Voice)
- Users can answer via typing or speaking
- Voice input powered by browser speech recognition
- Enhances real interview simulation experience

### 📊 Intelligent Feedback System
- Evaluates responses based on:
  - Confidence level
  - Grammar accuracy
  - Technical correctness
- Provides improvement suggestions and insights

### 🤖 Hybrid AI + ML Model
- Primary evaluation using OpenAI API
- Local ML model as fallback for offline or API failure scenarios
- Ensures reliability and continuous functionality

### 📈 Performance Tracking
- Tracks user scores over multiple sessions
- Helps monitor improvement and identify weak areas
- Visual performance charts

### ⚙️ Scalable Backend APIs
- RESTful APIs for question generation, feedback, and model training
- Efficient backend using FastAPI

### 🧪 Custom ML Training Support
- Allows training of domain-specific feedback models
- Uses structured dataset for improving scoring accuracy

### 🌐 User-Friendly Interface
- Clean and responsive UI built with React and Tailwind CSS
- Smooth interaction and real-time feedback display

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL / SQLite
- **ORM**: SQLAlchemy
- **AI/ML**: OpenAI API, scikit-learn, PyTorch
- **Authentication**: JWT
- **Server**: Uvicorn

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: React Icons

### Machine Learning
- **Models**: scikit-learn (Random Forest)
- **Feature Processing**: NumPy, pandas
- **Speech Recognition**: Google Speech-to-Text API

## 📁 Project Structure

```
MockMate AI/
├── backend/
│   ├── main.py                 # FastAPI application entry point
│   ├── models.py               # SQLAlchemy database models
│   ├── database.py             # Database configuration
│   ├── security.py             # Authentication & security
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example             # Environment variables template
│   ├── routes/
│   │   ├── auth.py             # Authentication endpoints
│   │   ├── questions.py        # Question generation endpoints
│   │   ├── feedback.py         # Feedback evaluation endpoints
│   │   ├── users.py            # User management endpoints
│   │   └── models.py           # Model training endpoints
│   └── services/
│       ├── question_generator.py    # AI question generation
│       ├── feedback_evaluator.py    # OpenAI-based evaluation
│       ├── ml_evaluator.py         # Local ML evaluation
│       ├── ml_trainer.py           # Model training
│       └── speech_to_text.py       # Voice transcription
│
├── frontend/
│   ├── index.html              # HTML entry point
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── package.json            # Node dependencies
│   ├── src/
│   │   ├── main.jsx            # React entry point
│   │   ├── App.jsx             # Main App component
│   │   ├── index.css           # Global styles
│   │   ├── components/
│   │   │   └── Layout.jsx      # App layout wrapper
│   │   ├── pages/
│   │   │   ├── HomePage.jsx    # Landing page
│   │   │   ├── LoginPage.jsx   # User login
│   │   │   ├── RegisterPage.jsx# User registration
│   │   │   ├── DashboardPage.jsx# User dashboard
│   │   │   ├── InterviewPage.jsx# Interview interface
│   │   │   └── ResultsPage.jsx # Results display
│   │   ├── services/
│   │   │   └── api.js          # API integration
│   │   └── store/
│   │       └── index.js        # Zustand state management
│   └── public/                 # Static assets
│
├── ml-model/                   # ML models directory
│   ├── models/                 # Trained model storage
│   ├── data/                   # Training datasets
│   └── README.md               # ML documentation
│
├── docs/                       # Documentation
└── README.md                   # Project README
```

## 🚀 Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+ (or SQLite for development)
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file from template:
```bash
cp .env.example .env
```

5. Configure environment variables in `.env`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## ⚙️ Configuration

### Backend Configuration

Edit `backend/.env`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mockmate_db

# OpenAI
OPENAI_API_KEY=your_api_key_here

# JWT
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Server
DEBUG=True
ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend Configuration

The frontend is configured to proxy API calls to `http://localhost:8000/api`.

Modify `frontend/vite.config.js` if your backend runs on a different URL.

## 🏃 Running the Application

### Start Backend

```bash
cd backend
python main.py
```

The API will be available at `http://localhost:8000`
API docs: `http://localhost:8000/docs`

### Start Frontend

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Question Endpoints

- `POST /api/questions/generate` - Generate interview questions
- `GET /api/questions/all` - Get all questions
- `GET /api/questions/{id}` - Get specific question

### Feedback Endpoints

- `POST /api/feedback/evaluate` - Evaluate text answer
- `POST /api/feedback/evaluate-voice` - Evaluate voice answer
- `GET /api/feedback/history/{interview_id}` - Get feedback history

### User Endpoints

- `POST /api/users/start-interview` - Start new interview
- `POST /api/users/end-interview/{interview_id}` - End interview
- `GET /api/users/performance/{user_id}` - Get performance history
- `GET /api/users/interviews/{user_id}` - Get all interviews

### Model Endpoints

- `POST /api/models/train-local-model` - Train ML model
- `GET /api/models/model-status` - Get model status

## 💾 Database Schema

### Users Table
- id (PK)
- email (unique)
- username (unique)
- hashed_password
- full_name
- is_active
- created_at
- updated_at

### Interviews Table
- id (PK)
- user_id (FK)
- interview_type
- difficulty
- score
- duration
- started_at
- completed_at

### Questions Table
- id (PK)
- text
- category
- difficulty
- tags
- model_generated
- created_at

### Interview Questions Table
- id (PK)
- interview_id (FK)
- question_id (FK)
- answer_text
- answer_audio_path
- confidence_score
- grammar_score
- technical_score
- overall_score
- feedback
- answered_at

### Performance History Table
- id (PK)
- user_id (FK)
- category
- average_score
- total_interviews
- last_updated

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email support@mockmate.ai or open an issue on GitHub.

## 🎉 Acknowledgments

- OpenAI for powerful language models
- FastAPI for the excellent web framework
- React community for amazing tools
- All contributors and users

---

**Made with ❤️ for interview preparation**
