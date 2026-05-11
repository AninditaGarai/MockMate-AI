# API Reference

## Base URL
```
http://localhost:8000/api
```

## Authentication

All endpoints (except `/auth/register` and `/auth/login`) require Bearer token:

```
Authorization: Bearer <access_token>
```

## Response Format

Success:
```json
{
  "data": {...}
}
```

Error:
```json
{
  "detail": "Error message"
}
```

## Endpoints

### Auth Routes (`/auth`)

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "full_name": "John Doe"
}

Response (200):
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "full_name": "John Doe",
  "is_active": true
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

#### Get Current User
```
GET /auth/me
Authorization: Bearer <token>

Response (200):
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "full_name": "John Doe",
  "is_active": true
}
```

### Question Routes (`/questions`)

#### Generate Questions
```
POST /questions/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "SDE",
  "difficulty": "medium",
  "count": 5
}

Response (200):
{
  "questions": [
    {
      "id": 1,
      "text": "Explain the difference between...",
      "category": "SDE",
      "difficulty": "medium",
      "tags": "data-structures,arrays"
    }
  ],
  "generated_by": "openai"
}
```

#### Get All Questions
```
GET /questions/all?category=SDE&difficulty=medium
Authorization: Bearer <token>

Response (200):
[
  {
    "id": 1,
    "text": "Question text...",
    "category": "SDE",
    "difficulty": "medium",
    "tags": "..."
  }
]
```

#### Get Specific Question
```
GET /questions/123
Authorization: Bearer <token>

Response (200):
{
  "id": 123,
  "text": "Question text...",
  "category": "SDE",
  "difficulty": "medium",
  "tags": "..."
}
```

### Feedback Routes (`/feedback`)

#### Evaluate Text Answer
```
POST /feedback/evaluate
Authorization: Bearer <token>
Content-Type: application/json

{
  "interview_id": 1,
  "question_id": 5,
  "answer_text": "Your answer here...",
  "use_ml_model": false
}

Response (200):
{
  "confidence_score": 85,
  "grammar_score": 90,
  "technical_score": 78,
  "overall_score": 84.3,
  "feedback": "Great response! You demonstrated...",
  "model_used": "openai"
}
```

#### Evaluate Voice Answer
```
POST /feedback/evaluate-voice?interview_id=1&question_id=5
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
  audio_file: [audio file]

Response (200):
{
  "confidence_score": 82,
  "grammar_score": 88,
  "technical_score": 75,
  "overall_score": 81.7,
  "transcribed_text": "Your transcribed answer...",
  "feedback": "Good effort! Consider...",
  "model_used": "openai"
}
```

#### Get Feedback History
```
GET /feedback/history/1
Authorization: Bearer <token>

Response (200):
[
  {
    "question_id": 1,
    "answer": "Answer text...",
    "confidence_score": 85,
    "grammar_score": 90,
    "technical_score": 78,
    "overall_score": 84.3,
    "feedback": "..."
  }
]
```

### User Routes (`/users`)

#### Start Interview
```
POST /users/start-interview
Authorization: Bearer <token>
Content-Type: application/json

{
  "interview_type": "SDE",
  "difficulty": "medium"
}

Response (200):
{
  "interview_id": 42,
  "started_at": "2024-01-15T10:30:00",
  "type": "SDE",
  "difficulty": "medium"
}
```

#### End Interview
```
POST /users/end-interview/42
Authorization: Bearer <token>

Response (200):
{
  "interview_id": 42,
  "score": 82.5,
  "completed_at": "2024-01-15T11:30:00",
  "total_questions": 5
}
```

#### Get User Performance
```
GET /users/performance/1
Authorization: Bearer <token>

Response (200):
[
  {
    "category": "SDE",
    "average_score": 78.5,
    "total_interviews": 5,
    "last_updated": "2024-01-15T11:30:00"
  }
]
```

#### Get User Interviews
```
GET /users/interviews/1
Authorization: Bearer <token>

Response (200):
[
  {
    "id": 42,
    "type": "SDE",
    "difficulty": "medium",
    "score": 82.5,
    "started_at": "2024-01-15T10:30:00",
    "completed_at": "2024-01-15T11:30:00"
  }
]
```

### Model Routes (`/models`)

#### Train Local Model
```
POST /models/train-local-model
Authorization: Bearer <token>
Content-Type: application/json

{
  "training_data": [
    {
      "question": "What is...",
      "answer": "It is...",
      "confidence_score": 85,
      "grammar_score": 90,
      "technical_score": 78,
      "overall_score": 84.3,
      "feedback": "Good response"
    }
  ]
}

Response (200):
{
  "status": "success",
  "message": "Model trained successfully",
  "model_path": "./ml_model/models/feedback_model.pkl",
  "samples_used": 100
}
```

#### Get Model Status
```
GET /models/model-status
Authorization: Bearer <token>

Response (200):
{
  "openai_api": {
    "available": true,
    "model": "gpt-4"
  },
  "local_model": {
    "available": true,
    "path": "./ml_model/models/feedback_model.pkl"
  }
}
```

## Error Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

Current limits:
- Authentication: 5 requests/minute
- Questions: 30 requests/minute
- Feedback: 60 requests/minute
- Model Training: 5 requests/minute

## Pagination

For list endpoints, use query parameters:
- `skip`: Number of records to skip (default: 0)
- `limit`: Number of records to return (default: 10)

Example:
```
GET /questions/all?skip=0&limit=20
```

## Filtering

Supported filters for list endpoints:
- `category`: Filter by category
- `difficulty`: Filter by difficulty
- `date_from`: Filter by start date
- `date_to`: Filter by end date

Example:
```
GET /questions/all?category=SDE&difficulty=hard
```
