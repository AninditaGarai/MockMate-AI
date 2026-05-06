# Troubleshooting Guide

## Common Issues and Solutions

### Backend Issues

#### ❌ ModuleNotFoundError: No module named 'fastapi'

**Problem**: Dependencies not installed

**Solution**:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### ❌ Port 8000 already in use

**Problem**: Another process is using port 8000

**Solution**:

Windows:
```bash
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

Linux/Mac:
```bash
lsof -i :8000
kill -9 <PID>
```

#### ❌ Database connection error

**Problem**: Database not configured or running

**Solution**:

Using SQLite (development):
```bash
# Delete old database
rm mockmate.db

# Backend will recreate automatically on startup
python main.py
```

Using PostgreSQL:
```bash
# Check DATABASE_URL in .env
# Ensure PostgreSQL is running
# For Docker: docker-compose up db
```

#### ❌ OpenAI API Error

**Problem**: Invalid API key or quota exceeded

**Solution**:

1. Check `.env` file:
```env
OPENAI_API_KEY=your_actual_key_here
```

2. Verify at https://platform.openai.com/account/api-keys
3. Check usage and quota at https://platform.openai.com/account/usage
4. Ensure API key has proper permissions

#### ❌ CORS Error in browser

**Problem**: Cross-Origin Request Blocked

**Solution**:

1. Check `FRONTEND_URL` in `backend/.env`:
```env
FRONTEND_URL=http://localhost:3000
```

2. Verify CORS configuration in `backend/main.py`
3. Ensure frontend is making requests to correct API URL
4. Check browser console for exact error

#### ❌ JWT Token Expired

**Problem**: Getting 401 Unauthorized

**Solution**:

1. Clear localStorage:
```javascript
localStorage.removeItem('access_token')
```

2. Re-login
3. Check `ACCESS_TOKEN_EXPIRE_MINUTES` in `.env`

### Frontend Issues

#### ❌ npm ERR! not ok code 0

**Problem**: npm package installation failed

**Solution**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### ❌ Port 3000 already in use

**Problem**: Another process using port 3000

**Solution**:

Windows:
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Linux/Mac:
```bash
lsof -i :3000
kill -9 <PID>
```

#### ❌ Blank page or 404 error

**Problem**: Frontend not connecting to backend

**Solution**:

1. Check backend is running on port 8000
2. Verify API URL in `frontend/vite.config.js`
3. Check browser Network tab for failed requests
4. Clear cache: Ctrl+Shift+Delete (Chrome)

#### ❌ "Cannot GET /" error

**Problem**: Wrong development server

**Solution**:

```bash
# Make sure you're running Vite dev server, not build
cd frontend
npm run dev  # Correct - runs on http://localhost:3000
# NOT: npm run build (this creates production files)
```

#### ❌ Tailwind CSS not applying

**Problem**: Styles not loading

**Solution**:

1. Verify `index.css` imports Tailwind:
```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
```

2. Check `tailwind.config.js` content paths
3. Clear cache: `npm run dev` (restart dev server)

### Docker Issues

#### ❌ Docker build fails

**Problem**: Build error

**Solution**:
```bash
# Clean Docker
docker system prune -a

# Rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up
```

#### ❌ Container exits immediately

**Problem**: Application crashes on startup

**Solution**:

```bash
# Check logs
docker-compose logs backend    # or frontend
docker-compose logs -f backend # follow logs
```

#### ❌ Cannot connect to localhost:5432 (database)

**Problem**: Database container not running

**Solution**:
```bash
# Ensure DB container is up
docker-compose ps

# If not running
docker-compose up db

# Check DB logs
docker-compose logs db
```

### API Issues

#### ❌ 422 Unprocessable Entity

**Problem**: Invalid request format

**Solution**:

1. Check request body matches schema:
```python
# Check routes for expected format
# Example: POST /auth/login expects:
# {"email": "...", "password": "..."}
```

2. Verify content-type header:
```
Content-Type: application/json
```

#### ❌ 401 Unauthorized

**Problem**: Missing or invalid token

**Solution**:

1. Include Authorization header:
```
Authorization: Bearer <your_token_here>
```

2. Check token is still valid
3. Re-login to get new token

#### ❌ 500 Internal Server Error

**Problem**: Server error

**Solution**:

1. Check backend logs:
```bash
# If running locally
# Check console output for error messages

# If using Docker
docker-compose logs backend
```

2. Common causes:
   - Missing environment variables
   - Database connection error
   - API rate limit exceeded
   - Unhandled exception in code

### Database Issues

#### ❌ Database locked error

**Problem**: SQLite database locked

**Solution**:
```bash
# With SQLite, only one process can write at a time
# Ensure only one backend instance is running

# Restart backend
# Kill all Python processes and start fresh
```

#### ❌ Migration errors with PostgreSQL

**Problem**: Database schema mismatch

**Solution**:

1. Drop and recreate database:
```bash
dropdb mockmate_db
createdb mockmate_db
```

2. Or with docker:
```bash
docker-compose down -v  # -v removes volumes
docker-compose up
```

### ML Model Issues

#### ❌ Model not found error

**Problem**: Trained model doesn't exist

**Solution**:

1. Train model first:
```bash
curl -X POST http://localhost:8000/api/models/train-local-model \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{...training_data...}'
```

2. Or fallback will be used automatically

#### ❌ Voice recognition not working

**Problem**: Speech-to-text fails

**Solution**:

1. Ensure microphone permissions granted
2. Check browser console for errors
3. Verify SpeechRecognition API supported (Chrome, Edge, Safari)
4. Try different browser if not working

### Performance Issues

#### 🐢 Slow API responses

**Problem**: Requests taking too long

**Solution**:

1. Check database:
   - Ensure indexes on frequently queried columns
   - Check query performance

2. Check OpenAI API:
   - May be rate limited
   - Check API status

3. Check network:
   - Latency to server
   - Bandwidth

#### 💾 High memory usage

**Problem**: Application using too much memory

**Solution**:

1. Check for memory leaks:
   - Restart application
   - Monitor memory over time

2. Optimize queries:
   - Use pagination
   - Limit results

3. Clear cache:
   - Browser cache
   - Server cache

## Debug Mode

### Backend Debug

```python
# Enable debug logging in main.py
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Frontend Debug

Open browser DevTools:
- Chrome/Edge: F12 or Ctrl+Shift+I
- Firefox: F12 or Ctrl+Shift+I
- Safari: Cmd+Option+I

Check:
- Console tab for errors
- Network tab for API calls
- Application tab for localStorage

## Getting Help

If you can't find solution:

1. Check full logs:
```bash
# Backend
python -u main.py  # unbuffered output

# Frontend
npm run dev  # check console output
```

2. Search GitHub issues
3. Check documentation in `/docs/`
4. Review API Reference in `docs/API_REFERENCE.md`

## Performance Optimization Tips

1. **Database**:
   - Use indexes on frequently queried columns
   - Implement pagination
   - Use connection pooling

2. **API**:
   - Implement caching
   - Use response compression
   - Rate limiting

3. **Frontend**:
   - Code splitting
   - Lazy loading
   - Image optimization
   - Minification

## Security Checklist

- [ ] Change default SECRET_KEY
- [ ] Use strong database password
- [ ] Enable HTTPS in production
- [ ] Configure CORS properly
- [ ] Validate all inputs
- [ ] Use environment variables for secrets
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Regular security updates

---

**Still having issues?** Check the project documentation or open an issue on GitHub.
