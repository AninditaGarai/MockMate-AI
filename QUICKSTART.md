# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Python 3.8+ installed
- Node.js 16+ installed
- Git installed

### Step 1: Clone/Setup Repository

```bash
cd MockMate\ AI
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=your_key_here
```

### Step 3: Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install
```

### Step 4: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python main.py
```

Backend runs on: `http://localhost:8000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Frontend runs on: `http://localhost:3000`

### Step 5: Access the Application

1. Open browser and go to `http://localhost:3000`
2. Register a new account
3. Start your first interview!

## 📖 Basic Usage

### Starting an Interview
1. Log in to your account
2. Click "Start Interview" on the dashboard
3. Choose interview type (SDE, AI/ML, HR)
4. Select difficulty level (Easy, Medium, Hard)
5. Click "Start Interview"

### Answering Questions
- **Text Mode**: Type your answer and click "Submit Answer"
- **Voice Mode**: Click the microphone icon to record your answer

### Viewing Results
After completing an interview, you'll see:
- Confidence score
- Grammar score
- Technical score
- Overall score
- Detailed feedback for each answer

## 🔑 Configuration

### Backend Configuration (`.env`)

```env
# Required
OPENAI_API_KEY=your_openai_key_here

# Database (optional, defaults to SQLite)
DATABASE_URL=sqlite:///./mockmate.db

# JWT Secret (change in production)
SECRET_KEY=your-secret-key-change-this
```

### Frontend Configuration

The frontend automatically connects to `http://localhost:8000/api`

To change, edit `frontend/vite.config.js`

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Port 8000 (backend)
# Port 3000 (frontend)

# Kill existing process
# Windows: taskkill /PID <pid> /F
# Linux/Mac: kill -9 <pid>
```

### OpenAI API Error
- Verify your API key is correct
- Check API quota at openai.com
- Ensure API key has permissions

### Database Error
- Delete `mockmate.db` if using SQLite
- Backend will recreate on next run

### Frontend Not Loading
- Check if backend is running
- Clear browser cache
- Check console for errors

## 📚 Next Steps

1. **Add More Questions**: Edit `backend/services/question_generator.py`
2. **Train ML Model**: Use `backend/services/ml_trainer.py`
3. **Deploy**: See `docs/DEPLOYMENT.md`
4. **Customize UI**: Modify components in `frontend/src/`

## 🆘 Need Help?

Check documentation:
- Backend: `backend/main.py` comments
- Frontend: `frontend/src/App.jsx` structure
- Full guide: See `README.md`

## 📝 Common Commands

```bash
# Backend
python main.py                 # Start server
pip install package-name       # Install package

# Frontend
npm run dev                    # Development server
npm run build                  # Build for production
npm install package-name       # Install package
```

## 🎯 Key Features to Explore

1. **AI Question Generation**: System generates unique questions
2. **Smart Feedback**: Intelligent evaluation of your answers
3. **Performance Tracking**: See your progress over time
4. **Voice Input**: Practice speaking skills
5. **Multiple Categories**: SDE, AI/ML, HR questions
6. **Difficulty Levels**: Easy, Medium, Hard questions

---

**Ready to ace your interviews? Let's get started!** 🎉
