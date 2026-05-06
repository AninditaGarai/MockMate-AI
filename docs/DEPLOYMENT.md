# Deployment Guide

## Local Development Setup

### Quick Start

1. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with your configuration
   python main.py
   ```

2. **Frontend Setup** (in another terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Docker Deployment

### Create Docker Compose File

Create `docker-compose.yml` in the project root:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: mockmate
      POSTGRES_PASSWORD: your_password
      POSTGRES_DB: mockmate_db
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://mockmate:your_password@db:5432/mockmate_db
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      SECRET_KEY: ${SECRET_KEY}
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      VITE_API_URL: http://localhost:8000/api

volumes:
  postgres_data:
```

### Run with Docker

```bash
docker-compose up
```

## Production Deployment

### Recommended Platforms

1. **Heroku**
   - Backend: Free dyno or paid tier
   - Database: Heroku PostgreSQL

2. **AWS**
   - Backend: EC2 or Elastic Beanstalk
   - Frontend: S3 + CloudFront
   - Database: RDS PostgreSQL

3. **DigitalOcean**
   - Backend: App Platform
   - Frontend: Spaces + CDN
   - Database: Managed Database

### Environment Variables for Production

```env
DEBUG=False
ENV=production
DATABASE_URL=postgresql://user:password@host:5432/dbname
OPENAI_API_KEY=your_production_key
SECRET_KEY=your_long_random_secret_key
FRONTEND_URL=https://your-domain.com
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
```

## SSL/TLS Configuration

For production, always use HTTPS:

```bash
# Using Let's Encrypt with Certbot
certbot certonly --standalone -d your-domain.com
```

Update your server configuration to use the certificates.

## Database Backups

```bash
# PostgreSQL backup
pg_dump -U user -d mockmate_db > backup.sql

# Restore
psql -U user -d mockmate_db < backup.sql
```

## Monitoring & Logging

1. **Application Logging**
   - Configure FastAPI logging in `backend/main.py`
   - Use tools like: ELK Stack, Datadog, or New Relic

2. **Performance Monitoring**
   - Use APM tools for monitoring
   - Track API response times
   - Monitor database performance

## Security Checklist

- [ ] Update OPENAI_API_KEY
- [ ] Generate strong SECRET_KEY
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable database encryption
- [ ] Set up regular backups
- [ ] Configure firewall rules
- [ ] Enable rate limiting
- [ ] Set up monitoring and alerts

## Scaling Considerations

1. **Backend Scaling**
   - Use load balancer (nginx, HAProxy)
   - Scale API instances horizontally
   - Use Redis for caching

2. **Database Scaling**
   - Read replicas for high traffic
   - Connection pooling
   - Query optimization

3. **Frontend Optimization**
   - CDN for static assets
   - Code splitting and lazy loading
   - Caching strategies
