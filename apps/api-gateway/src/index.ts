import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import todoRoutes from './routes/todo.routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors())
app.use(express.json())

// Logging middleware
app.use((req: Request, res: Response, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    service: 'api-gateway',
    timestamp: new Date().toISOString()
  })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/todos', todoRoutes)

// 404 handler
// app.use((req: Request, res: Response) => {
//   res.status(404).json({ error: 'Route not found' })
// })

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`)
  console.log(`📍 Health check: http://localhost:${PORT}/health`)
})