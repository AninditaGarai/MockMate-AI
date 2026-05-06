# Getting Started Checklist

## ✅ Pre-Setup Checklist

- [ ] Python 3.8+ installed: `python --version`
- [ ] Node.js 16+ installed: `node --version`
- [ ] npm installed: `npm --version`
- [ ] Git installed (optional): `git --version`
- [ ] OpenAI API key obtained from https://platform.openai.com

## ✅ Backend Setup Checklist

### Step 1: Environment
- [ ] Navigate to backend folder
- [ ] Create virtual environment: `python -m venv venv`
- [ ] Activate venv: `source venv/bin/activate` (Mac/Linux) or `venv\Scripts\activate` (Windows)
- [ ] Verify venv active: Command prompt should show `(venv)`

### Step 2: Dependencies
- [ ] Install requirements: `pip install -r requirements.txt`
- [ ] Verify installation: `pip list | grep fastapi`

### Step 3: Configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Edit `.env` and add:
  - `OPENAI_API_KEY=your_key_here`
  - `SECRET_KEY=your_secret_key` (any random string)
  - `DATABASE_URL=sqlite:///./mockmate.db` (for development)

### Step 4: Verification
- [ ] Start backend: `python main.py`
- [ ] Verify running: Navigate to http://localhost:8000/docs
- [ ] See API documentation: ✅ If page loads
- [ ] Health check: http://localhost:8000/health returns `{"status": "healthy"}`

## ✅ Frontend Setup Checklist

### Step 1: Navigate & Install
- [ ] Navigate to frontend folder
- [ ] Install dependencies: `npm install`
- [ ] Wait for completion (may take 2-3 minutes)

### Step 2: Configuration
- [ ] Check `vite.config.js` for API proxy (should be http://localhost:8000)
- [ ] No changes needed for local development

### Step 3: Verification
- [ ] Start frontend: `npm run dev`
- [ ] Wait for "ready in X ms"
- [ ] Open http://localhost:3000
- [ ] See MockMate AI landing page: ✅ If page loads

## ✅ Application Testing Checklist

### Authentication
- [ ] Navigate to http://localhost:3000/register
- [ ] Create new account
- [ ] Fill all fields and register
- [ ] Verify redirect to dashboard

### Login
- [ ] Logout (click user menu)
- [ ] Go to login page
- [ ] Login with credentials
- [ ] Verify dashboard loads

### Interview
- [ ] Click "Start Interview"
- [ ] Select SDE, Medium, and start
- [ ] See interview interface with question
- [ ] Type an answer
- [ ] Click "Submit Answer"
- [ ] Verify feedback displays with scores

### Results
- [ ] Complete interview (multiple questions)
- [ ] Click "Finish Interview"
- [ ] View results page
- [ ] Verify scores displayed
- [ ] Verify chart showing performance

## ✅ Docker Setup Checklist (Optional)

- [ ] Docker installed and running
- [ ] Docker Compose installed
- [ ] Create `.env` in project root with OpenAI key
- [ ] Run: `docker-compose up`
- [ ] Wait for services to start
- [ ] Access frontend: http://localhost:3000
- [ ] Access API: http://localhost:8000

## ✅ Common Issues to Check

### Backend Won't Start
- [ ] Check Python version: `python --version` (should be 3.8+)
- [ ] Check venv activated: Prompt should show `(venv)`
- [ ] Check dependencies: `pip list | grep -i fastapi`
- [ ] Check .env exists: `backend/.env`
- [ ] Check port 8000 not in use: `lsof -i :8000` (Mac/Linux)

### Frontend Won't Start
- [ ] Check Node.js version: `node --version` (should be 16+)
- [ ] Check npm installed: `npm --version`
- [ ] Check dependencies: `ls frontend/node_modules` (should exist)
- [ ] Check port 3000 not in use

### Can't Connect Frontend to Backend
- [ ] Verify backend running: http://localhost:8000/health
- [ ] Check API URL in browser console (Network tab)
- [ ] Verify `vite.config.js` proxy settings
- [ ] Check CORS in backend: Should allow localhost:3000

### OpenAI API Error
- [ ] Verify API key in `.env`: `OPENAI_API_KEY=sk-...`
- [ ] Check API key valid: https://platform.openai.com/account/api-keys
- [ ] Check API quota: https://platform.openai.com/account/usage
- [ ] Check API key has chat completions permissions

## ✅ First Interview Workflow

1. **Register** (http://localhost:3000/register)
   - Fill all fields
   - Click Register
   - Auto-login to dashboard

2. **Start Interview** (Dashboard)
   - Select "SDE" category
   - Select "Medium" difficulty
   - Click "Start Interview"

3. **Answer Question**
   - Read the question displayed
   - Type or voice answer
   - Click "Submit Answer"

4. **View Feedback**
   - See scores: Confidence, Grammar, Technical, Overall
   - Read detailed feedback
   - Click "Next Question" or "Finish Interview"

5. **View Results**
   - See performance summary
   - View performance trend chart
   - Read detailed feedback for each answer

## ✅ Post-Setup Optimization

### Performance
- [ ] Set `DEBUG=False` in `.env` for production
- [ ] Consider PostgreSQL for production
- [ ] Setup caching layer (Redis)
- [ ] Optimize database queries

### Security
- [ ] Generate strong `SECRET_KEY`: `openssl rand -hex 32`
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS in production
- [ ] Configure CORS properly
- [ ] Setup rate limiting

### Monitoring
- [ ] Setup error logging
- [ ] Monitor API response times
- [ ] Track user activity
- [ ] Monitor database performance

## ✅ Next Steps After Setup

1. **Customize**
   - Add more interview questions in `backend/services/question_generator.py`
   - Modify UI in `frontend/src/`
   - Add custom categories

2. **Train ML Model**
   - Collect interview data
   - Train local model using `/api/models/train-local-model`
   - Test model evaluation

3. **Deploy**
   - Follow `docs/DEPLOYMENT.md`
   - Choose hosting platform
   - Setup CI/CD pipeline

4. **Scale**
   - Switch to PostgreSQL
   - Add caching (Redis)
   - Implement CDN for frontend
   - Load balance backend

## ✅ Documentation Links

- Quick Start: `QUICKSTART.md`
- Full Setup: `README.md`
- API Reference: `docs/API_REFERENCE.md`
- Development: `docs/DEVELOPMENT.md`
- Deployment: `docs/DEPLOYMENT.md`
- Troubleshooting: `docs/TROUBLESHOOTING.md`

## ✅ Support Resources

### If Something Fails
1. Check exact error message
2. Search `docs/TROUBLESHOOTING.md`
3. Check backend logs: Console output
4. Check frontend logs: Browser DevTools (F12)
5. Review API Reference: `docs/API_REFERENCE.md`

### Helpful Commands

```bash
# Backend
python main.py                    # Start backend
pip install -r requirements.txt   # Install deps
python -m pytest                  # Run tests

# Frontend
npm run dev                       # Start dev server
npm run build                     # Build for production
npm run preview                   # Preview build

# Docker
docker-compose up                 # Start all services
docker-compose down              # Stop all services
docker-compose logs -f backend   # View logs
```

## ✅ Success Indicators

✅ **Backend Running**
- Terminal shows "Uvicorn running on..."
- http://localhost:8000/health returns healthy

✅ **Frontend Running**
- Terminal shows "ready in XXms"
- http://localhost:3000 loads MockMate AI page

✅ **Connected**
- Can register new account
- Can login successfully
- Can start interview

✅ **Working**
- Questions display
- Feedback shows scores
- Results page displays

---

**Congratulations!** 🎉 Your AI Interview Simulator is ready to use!

For issues, check `docs/TROUBLESHOOTING.md` or review the full README.
