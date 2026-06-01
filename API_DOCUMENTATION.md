# Todo App API Documentation

This document reflects the current implemented API surface.

## Architecture Overview

- API Gateway (default `http://localhost:4000`): auth + todo APIs
- AI Service (configured port): AI analysis endpoint

## API Gateway

### Health

#### GET /health

Response:
```json
{
  "status": "ok",
  "service": "api-gateway",
  "timestamp": "ISO string"
}
```

### Auth Endpoints

#### POST /api/auth/register

Input:
```json
{
  "email": "string (required)",
  "password": "string (required)",
  "name": "string (optional)"
}
```

Output:
```json
{
  "message": "User registered successfully",
  "token": "JWT",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string | null"
  }
}
```

#### POST /api/auth/login

Input:
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

Output:
```json
{
  "message": "Login successful",
  "token": "JWT",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string | null"
  }
}
```

#### GET /api/auth/verify

Headers:
- `Authorization: Bearer <token>`

Output:
```json
{
  "valid": true,
  "user": {
    "id": "string",
    "email": "string",
    "name": "string | null"
  }
}
```

### Todo Endpoints

All todo endpoints require `Authorization: Bearer <token>`.

#### POST /api/todos

Input:
```json
{
  "title": "string (required, non-empty, max 255)",
  "description": "string (optional, max 1000)",
  "priority": "low | medium | high (optional)",
  "dueDate": "ISO date string (optional)",
  "aiGenerated": "boolean (optional)"
}
```

Output:
```json
{
  "message": "Todo created successfully",
  "todo": {
    "id": "string",
    "title": "string",
    "description": "string | null",
    "completed": false,
    "priority": "low | medium | high",
    "dueDate": "string | null",
    "aiGenerated": false,
    "createdAt": "string",
    "updatedAt": "string",
    "userId": "string"
  }
}
```

#### GET /api/todos

Output:
```json
{
  "count": 1,
  "todos": []
}
```

#### GET /api/todos/:id

Output:
```json
{
  "todo": {}
}
```

#### PUT /api/todos/:id
#### PATCH /api/todos/:id

Input (partial update allowed in current implementation):
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "completed": "boolean (optional)",
  "priority": "low | medium | high (optional)",
  "dueDate": "ISO date string | null (optional)"
}
```

Output:
```json
{
  "message": "Todo updated successfully",
  "todo": {}
}
```

#### DELETE /api/todos/:id

Output:
```json
{
  "message": "Todo deleted successfully",
  "deletedId": "string"
}
```

## AI Service

### GET /health

Response:
```json
{
  "status": "healthy",
  "service": "ai-service",
  "timestamp": "ISO string"
}
```

### POST /api/ai/analyze

Input:
```json
{
  "text": "string (required)"
}
```

Output (current placeholder behavior):
```json
{
  "status": "success",
  "input": "string",
  "analysis": {
    "sentiment": "positive",
    "keywords": ["..."],
    "score": 0.85
  }
}
```
