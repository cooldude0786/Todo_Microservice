import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { authenticateToken } from './middleware/auth.middleware'
import { createTodo } from './controllers/todo.controller'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4002

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'todo-create-service' })
})

// Create todo endpoint (protected)
app.post('/api/todos', 
  authenticateToken,
   createTodo)

app.listen(PORT, () => {
  console.log(`��� Todo Create service running on port ${PORT}`)
})
