import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import todoRoutes from './routes/todo.routes.js'
import groupRoutes from './routes/group.routes.js'
import {
  errorHandler,
  notFoundHandler,
  requestLogger,
} from './middleware/index.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/todos', todoRoutes)
app.use('/api/groups', groupRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`)
  console.log(`📍 Health check: http://localhost:${PORT}/health`)
})
