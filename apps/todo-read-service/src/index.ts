import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { authenticateToken } from './middleware/auth.middleware.js'
import { getAllTodos, getTodoById } from './controllers/todo.controller.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4003

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'todo-read-service' })
})

// Read todos endpoints (protected)
app.get('/api/todos', authenticateToken, getAllTodos)
app.get('/api/todos/:id',
  //  authenticateToken,
    getTodoById)

app.listen(PORT, () => {
  console.log(`🚀 Todo Read service running on port ${PORT}`)
})