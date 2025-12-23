import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { authenticateToken } from './middleware/auth.middleware.js'
import { updateTodo } from './controllers/todo.controller.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4004

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'todo-update-service' })
})

// Update todo endpoint (protected)
app.put('/api/todos/:id', authenticateToken, updateTodo)
app.patch('/api/todos/:id', authenticateToken, updateTodo)

app.listen(PORT, () => {
  console.log(`🚀 Todo Update service running on port ${PORT}`)
})