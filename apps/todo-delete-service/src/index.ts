import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { authenticateToken } from './middleware/auth.middleware.js'
import { deleteTodo } from './controllers/todo.controller.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4005

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'todo-delete-service' })
})

// Delete todo endpoint (protected)
app.delete('/api/todos/:id', authenticateToken, deleteTodo)

app.listen(PORT, () => {
  console.log(`🚀 Todo Delete service running on port ${PORT}`)
})