# Todo App API Documentation

This document provides a comprehensive overview of all endpoints available in the microservices backend for the Todo App. This documentation is intended to assist with integrating a voice agent that transcribes user audio and determines which function to call.

## Architecture Overview

The application follows a microservices architecture with the following services:
- **API Gateway** (Port 4000): Centralized routing to other services
- **Auth Service** (Port 4001): Authentication and user management
- **Todo Create Service** (Port 4002): Creating new todos
- **Todo Read Service** (Port 4003): Reading todos
- **Todo Update Service** (Port 4004): Updating todos
- **Todo Delete Service** (Port 4005): Deleting todos

## API Gateway Endpoints

### Authentication Endpoints

#### POST /api/auth/register
**Purpose**: Register a new user account  
**Input**: 
```json
{
  "email": "string (required)",
  "password": "string (required, min 6 chars)",
  "name": "string (optional)"
}
```
**Output**: 
```json
{
  "message": "User registered successfully",
  "token": "JWT token string",
  "user": {
    "id": "user ID",
    "email": "email address",
    "name": "user name"
  }
}
```

#### POST /api/auth/login
**Purpose**: Authenticate user and return JWT token  
**Input**: 
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```
**Output**: 
```json
{
  "message": "Login successful",
  "token": "JWT token string",
  "user": {
    "id": "user ID",
    "email": "email address",
    "name": "user name"
  }
}
```

#### GET /api/auth/verify
**Purpose**: Verify JWT token and return user info  
**Input**: Authorization header with Bearer token  
**Output**: 
```json
{
  "valid": true,
  "user": {
    "id": "user ID",
    "email": "email address",
    "name": "user name"
  }
}
```

### Todo Endpoints

#### POST /api/todos
**Purpose**: Create a new todo for the authenticated user  
**Input** (with Authorization header containing JWT):
```json
{
  "title": "string (required, max 255 chars)",
  "description": "string (optional, max 1000 chars)",
  "priority": "string (optional, one of: 'low', 'medium', 'high', default: 'medium')",
  "dueDate": "string (optional, ISO date format)",
  "aiGenerated": "boolean (optional, default: false)"
}
```
**Output**: 
```json
{
  "message": "Todo created successfully",
  "todo": {
    "id": "todo ID",
    "title": "todo title",
    "description": "todo description",
    "completed": false,
    "priority": "todo priority",
    "dueDate": "due date or null",
    "aiGenerated": false,
    "createdAt": "creation timestamp",
    "updatedAt": "update timestamp",
    "userId": "user ID"
  }
}
```

#### GET /api/todos
**Purpose**: Retrieve all todos for the authenticated user  
**Input**: Authorization header with JWT  
**Output**: 
```json
{
  "count": "number of todos",
  "todos": [
    {
      "id": "todo ID",
      "title": "todo title",
      "description": "todo description",
      "completed": "boolean",
      "priority": "todo priority",
      "dueDate": "due date or null",
      "aiGenerated": "boolean",
      "createdAt": "creation timestamp",
      "updatedAt": "update timestamp",
      "userId": "user ID"
    }
  ]
}
```

#### GET /api/todos/:id
**Purpose**: Retrieve a specific todo by ID  
**Input**: Todo ID in URL path  
**Output**: 
```json
{
  "todo": {
    "id": "todo ID",
    "title": "todo title",
    "description": "todo description",
    "completed": "boolean",
    "priority": "todo priority",
    "dueDate": "due date or null",
    "aiGenerated": "boolean",
    "createdAt": "creation timestamp",
    "updatedAt": "update timestamp",
    "userId": "user ID"
  }
}
```

#### PUT /api/todos/:id
**Purpose**: Update all fields of a specific todo  
**Input** (with Authorization header containing JWT):
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "completed": "boolean (optional)",
  "priority": "string (optional)",
  "dueDate": "string (optional, ISO date format)"
}
```
**Output**: 
```json
{
  "message": "Todo updated successfully",
  "todo": {
    "id": "todo ID",
    "title": "updated title",
    "description": "updated description",
    "completed": "updated status",
    "priority": "updated priority",
    "dueDate": "updated due date or null",
    "aiGenerated": "boolean",
    "createdAt": "creation timestamp",
    "updatedAt": "update timestamp",
    "userId": "user ID"
  }
}
```

#### PATCH /api/todos/:id
**Purpose**: Partially update a specific todo  
**Input** (with Authorization header containing JWT):
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "completed": "boolean (optional)",
  "priority": "string (optional)",
  "dueDate": "string (optional, ISO date format)"
}
```
**Output**: 
```json
{
  "message": "Todo updated successfully",
  "todo": {
    "id": "todo ID",
    "title": "updated title",
    "description": "updated description",
    "completed": "updated status",
    "priority": "updated priority",
    "dueDate": "updated due date or null",
    "aiGenerated": "boolean",
    "createdAt": "creation timestamp",
    "updatedAt": "update timestamp",
    "userId": "user ID"
  }
}
```

#### DELETE /api/todos/:id
**Purpose**: Delete a specific todo by ID  
**Input**: Todo ID in URL path (with Authorization header containing JWT)  
**Output**: 
```json
{
  "message": "Todo deleted successfully",
  "deletedId": "ID of deleted todo"
}
```

## Health Check Endpoints

#### GET /health
**Available on all services**:
- API Gateway: `http://localhost:4000/health`
- Auth Service: `http://localhost:4001/health`
- Todo Create: `http://localhost:4002/health`
- Todo Read: `http://localhost:4003/health`
- Todo Update: `http://localhost:4004/health`
- Todo Delete: `http://localhost:4005/health`

**Output**:
```json
{
  "status": "ok",
  "service": "service-name",
  "timestamp": "ISO timestamp"
}
```

## Voice Agent Integration Guide

For voice agent integration, here are the key functions mapped to common user intents:

### User Registration/Authentication
- **Intent**: "Sign up with email user@example.com and password 123456"
  - **Action**: POST /api/auth/register
- **Intent**: "Log in with email user@example.com and password 123456"
  - **Action**: POST /api/auth/login
- **Intent**: "Am I logged in?"
  - **Action**: GET /api/auth/verify

### Todo Management
- **Intent**: "Add a task called 'Buy groceries'"
  - **Action**: POST /api/todos with title "Buy groceries"
- **Intent**: "Show my tasks"
  - **Action**: GET /api/todos
- **Intent**: "Mark task 'Buy groceries' as complete"
  - **Action**: PUT/PATCH /api/todos/{taskId} with completed: true
- **Intent**: "Delete the task called 'Buy groceries'"
  - **Action**: DELETE /api/todos/{taskId}
- **Intent**: "Set due date for 'Buy groceries' to tomorrow"
  - **Action**: PUT/PATCH /api/todos/{taskId} with dueDate: "YYYY-MM-DD"
- **Intent**: "Change priority of 'Buy groceries' to high"
  - **Action**: PUT/PATCH /api/todos/{taskId} with priority: "high"

### Notes for Voice Agent Development
1. All todo-related endpoints require authentication via JWT token in the Authorization header
2. The voice agent should maintain the user's JWT token after login for subsequent requests
3. For update operations, the agent will need to first fetch the todo ID for a given task name
4. The voice agent should handle validation errors gracefully (e.g., empty titles, invalid dates)
5. Priority values are limited to 'low', 'medium', and 'high'