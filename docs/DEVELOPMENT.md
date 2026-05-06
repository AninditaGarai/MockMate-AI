# Development Guide

## Project Setup

### Backend Development

1. **Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Database Setup**
   ```bash
   # For SQLite (development)
   python -c "from database import Base, engine; Base.metadata.create_all(bind=engine)"
   ```

### Frontend Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Development Server**
   ```bash
   npm run dev
   ```

## Code Structure

### Backend Architecture

```
services/
├── question_generator.py      # AI question generation
├── feedback_evaluator.py      # OpenAI-based feedback
├── ml_evaluator.py           # Local ML model evaluation
├── ml_trainer.py             # Model training logic
└── speech_to_text.py         # Voice transcription
```

### Frontend Architecture

```
src/
├── components/               # Reusable components
├── pages/                   # Page components
├── services/                # API calls
└── store/                   # State management
```

## Adding New Features

### Adding a New API Endpoint

1. **Create route file** in `backend/routes/`
2. **Import in main.py**: `app.include_router(router)`
3. **Implement business logic** in `backend/services/`
4. **Call from frontend** via `frontend/src/services/api.js`

### Adding a New Page

1. **Create component** in `frontend/src/pages/`
2. **Add route** in `frontend/src/App.jsx`
3. **Add navigation** link in `Layout.jsx`

## Testing

### Backend Testing

```bash
# Install pytest
pip install pytest pytest-httpx

# Run tests
pytest backend/tests/
```

### Frontend Testing

```bash
# Install Vitest
npm install --save-dev vitest

# Run tests
npm run test
```

## Debugging

### Backend Debugging

```python
# Add print statements or use debugger
import pdb; pdb.set_trace()
```

### Frontend Debugging

- Use React Developer Tools browser extension
- Check Network tab in browser DevTools
- Use `console.log()` or browser debugger

## Performance Optimization

### Backend
- Use database indexing
- Implement caching with Redis
- Optimize API response times
- Use pagination for large datasets

### Frontend
- Code splitting with React.lazy()
- Image optimization
- Minimize bundle size
- Use React.memo() for expensive components

## Database Migrations

For production, consider using Alembic:

```bash
pip install alembic
alembic init alembic
alembic revision --autogenerate -m "Add new column"
alembic upgrade head
```

## Common Issues

### Issue: CORS Error
**Solution**: Check `FRONTEND_URL` in `.env` and CORS configuration in `main.py`

### Issue: OpenAI API Error
**Solution**: Verify `OPENAI_API_KEY` and API quota

### Issue: Database Connection Error
**Solution**: Check `DATABASE_URL` and database server is running

### Issue: Port Already in Use
**Solution**: 
```bash
# Find process using port 8000
lsof -i :8000
# Kill process
kill -9 <PID>
```

## Resources

- FastAPI Docs: https://fastapi.tiangolo.com/
- React Docs: https://react.dev/
- SQLAlchemy Docs: https://docs.sqlalchemy.org/
- Tailwind CSS: https://tailwindcss.com/
- OpenAI API: https://platform.openai.com/docs/
