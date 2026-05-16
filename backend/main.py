from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import os
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Middleware: simple request logger for basic diagnostics

# Import routers
from routes import auth, questions, feedback, users, models

# Initialize FastAPI app
app = FastAPI(
    title="AI Interview Simulator API",
    description="Backend API for the AI Interview Simulator System",
    version="1.0.0"
)

# CORS configuration
default_origins = {
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8080",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
}

env_origins = {
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "").split(",")
    if origin.strip()
}

frontend_origin = os.getenv("FRONTEND_URL", "http://localhost:3000").strip()
origins = sorted(default_origins | env_origins | {frontend_origin})

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    elapsed_ms = (time.time() - start_time) * 1000
    print(f"{request.method} {request.url.path} completed_in={elapsed_ms:.2f}ms status_code={response.status_code}")
    return response

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(questions.router, prefix="/api/questions", tags=["Questions"])
app.include_router(feedback.router, prefix="/api/feedback", tags=["Feedback"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(models.router, prefix="/api/models", tags=["Models"])

# Create database tables (development)
from database import engine, Base
Base.metadata.create_all(bind=engine)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to AI Interview Simulator API",
        "version": "1.0.0",
        "docs": "/docs"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
