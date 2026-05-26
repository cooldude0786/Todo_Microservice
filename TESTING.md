# End-to-End Testing Guide

This guide will help you test the complete authentication and todo management flow for the Todo App.

## Prerequisites

- All services running (see SETUP.md)
- Postman or curl installed for API testing
- Modern web browser for UI testing

## Test Scenarios

### Scenario 1: User Registration

**UI Testing:**
1. Navigate to http://localhost:3000
2. Click "Sign Up" button
3. Fill in the registration form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "TestPassword123"
4. Click "Sign Up"
5. Verify redirect to login page

**API Testing:**
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testapi@example.com",
    "password": "TestPassword123",
    "name": "API Test User"
  }'
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

---

### Scenario 2: User Login

**UI Testing:**
1. Navigate to http://localhost:3000/login
2. Enter credentials:
   - Email: "test@example.com"
   - Password: "TestPassword123"
3. Click "Login"
4. Verify redirect to task dashboard

**API Testing:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

Save the token for subsequent requests.

---

### Scenario 3: Create a Todo (Authenticated)

**UI Testing:**
1. Logged-in dashboard at http://localhost:3000/task
2. In the task creation field:
   - Quick add: Type "Buy groceries" in the quick add field
   - Detailed form: Click "Create" to open the dialog
   - Fill in:
     - Title: "Prepare presentation"
     - Description: "Prepare Q4 presentation for stakeholders"
     - Priority: "High"
     - Due Date: "2024-12-20"
   - Click "Create"
3. Verify todo appears in the list

**API Testing:**
```bash
export TOKEN="your_jwt_token_from_login"

curl -X POST http://localhost:4000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "API Test Todo",
    "description": "This is a test todo via API",
    "priority": "medium",
    "dueDate": "2024-12-25"
  }'
```

**Expected Response:**
```json
{
  "message": "Todo created successfully",
  "todo": {
    "id": "todo_id",
    "title": "API Test Todo",
    "description": "This is a test todo via API",
    "priority": "medium",
    "dueDate": "2024-12-25",
    "completed": false,
    "aiGenerated": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "userId": "user_id"
  }
}
```

---

### Scenario 4: View All Todos

**UI Testing:**
1. On the dashboard at http://localhost:3000/task
2. Verify the data table displays all created todos
3. Verify columns: Title, Description, Completed, Priority, Due Date
4. Titles should be clickable links

**API Testing:**
```bash
curl -X GET http://localhost:4000/api/todos \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "count": 2,
  "todos": [
    {
      "id": "todo_id_1",
      "title": "Prepare presentation",
      "description": "Prepare Q4 presentation for stakeholders",
      "priority": "high",
      "dueDate": "2024-12-20",
      "completed": false,
      "aiGenerated": false,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "userId": "user_id"
    }
  ]
}
```

---

### Scenario 5: View Todo Details

**UI Testing:**
1. On the dashboard, click on any todo title (should be a blue link)
2. Verify the detail page shows:
   - Task title and status
   - Creation date
   - Full description
   - Priority badge with color coding
   - Due date
   - "Mark Complete" button
   - "Edit Task" and "Delete Task" buttons

**API Testing:**
```bash
export TODO_ID="todo_id_from_previous_response"

curl -X GET http://localhost:4000/api/todos/$TODO_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "todo": {
    "id": "todo_id",
    "title": "Prepare presentation",
    "description": "Prepare Q4 presentation for stakeholders",
    "priority": "high",
    "dueDate": "2024-12-20",
    "completed": false,
    "aiGenerated": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "userId": "user_id"
  }
}
```

---

### Scenario 6: Update a Todo

**UI Testing:**
1. On the detail page, click "Edit Task"
2. Modify fields:
   - Title: "Prepare presentation - UPDATED"
   - Priority: "Medium"
   - Due Date: "2024-12-22"
3. Click "Save Changes"
4. Verify updates are reflected on the detail page

**API Testing:**
```bash
curl -X PUT http://localhost:4000/api/todos/$TODO_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Prepare presentation - Updated",
    "priority": "medium",
    "dueDate": "2024-12-22"
  }'
```

**Expected Response:**
```json
{
  "message": "Todo updated successfully",
  "todo": {
    "id": "todo_id",
    "title": "Prepare presentation - Updated",
    "priority": "medium",
    "dueDate": "2024-12-22",
    "completed": false
  }
}
```

---

### Scenario 7: Mark Todo as Complete

**UI Testing:**
1. On the detail page, click "Mark Complete" button
2. Verify the todo title gets strikethrough styling
3. Button changes to "✓ Completed"

**API Testing:**
```bash
curl -X PUT http://localhost:4000/api/todos/$TODO_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "completed": true
  }'
```

**Expected Response:**
```json
{
  "message": "Todo updated successfully",
  "todo": {
    "id": "todo_id",
    "completed": true
  }
}
```

---

### Scenario 8: Delete a Todo

**UI Testing:**
1. On the detail page, click "Delete Task"
2. Confirm deletion in the alert dialog
3. Verify redirect to task list
4. Verify todo is removed from the list

**API Testing:**
```bash
curl -X DELETE http://localhost:4000/api/todos/$TODO_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "message": "Todo deleted successfully"
}
```

---

### Scenario 9: Security - User Isolation

**Test that users can only access their own todos:**

1. Create two different user accounts
2. Create todos with User A
3. Log in as User B
4. Verify User B cannot see User A's todos
5. Try to access User A's todo directly via API:

```bash
# This should fail
curl -X GET http://localhost:4000/api/todos/$USER_A_TODO_ID \
  -H "Authorization: Bearer $USER_B_TOKEN"
```

**Expected Response:**
```json
{
  "status": "error",
  "message": "Todo not found",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

### Scenario 10: Logout

**UI Testing:**
1. Navigate to http://localhost:3000/dashboard/profile
2. Click "Sign Out" button
3. Verify redirect to login page
4. Try accessing protected route (should redirect to login)

**Session Testing:**
```bash
# Access a protected endpoint with invalid/expired token
curl -X GET http://localhost:4000/api/todos \
  -H "Authorization: Bearer invalid_token"
```

**Expected Response:**
```json
{
  "status": "error",
  "message": "Authentication required",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## Error Scenarios

### Invalid Login Credentials

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "WrongPassword"
  }'
```

**Expected Response (400 or 401):**
```json
{
  "error": "Invalid email or password"
}
```

### Duplicate Email Registration

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123",
    "name": "Duplicate User"
  }'
```

**Expected Response (400):**
```json
{
  "error": "User already exists"
}
```

### Missing Required Fields

```bash
curl -X POST http://localhost:4000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "description": "Missing title field"
  }'
```

**Expected Response (400):**
```json
{
  "error": "Title is required"
}
```

### Unauthorized Access (No Token)

```bash
curl -X GET http://localhost:4000/api/todos
```

**Expected Response (401):**
```json
{
  "status": "error",
  "message": "Authentication required",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## Performance Testing

### Response Time Check

```bash
curl -w "Time taken: %{time_total}s\n" \
  -X GET http://localhost:4000/api/todos \
  -H "Authorization: Bearer $TOKEN"
```

Expected: Should complete in < 1 second

### Load Testing (Optional)

Use Apache Bench or similar:

```bash
ab -n 100 -c 10 -H "Authorization: Bearer $TOKEN" \
  http://localhost:4000/api/todos
```

---

## Debugging

### Enable Logging

Check service output in terminals for detailed logs:
- API Gateway logs requests and responses
- Auth Service logs authentication attempts
- Each Todo service logs operations

### Check Database

Use Prisma Studio to view database entries:

```bash
pnpm db:studio
```

### Check Environment Variables

Verify all services have correct environment variables:

```bash
# Check frontend
echo $NEXT_PUBLIC_API_BASE_URL

# Check gateway
echo $AUTH_SERVICE_URL
```

---

## Checklist

- [ ] User registration works
- [ ] User login works
- [ ] JWT token is generated correctly
- [ ] Todos can be created
- [ ] Todos can be viewed
- [ ] Todos can be updated
- [ ] Todos can be deleted
- [ ] Todo detail page displays correctly
- [ ] Edit form works on detail page
- [ ] Delete confirmation works
- [ ] Mark as complete toggles correctly
- [ ] User isolation is enforced
- [ ] Logout works and clears session
- [ ] Error boundaries catch errors
- [ ] API Gateway logs requests
- [ ] All services start without errors

