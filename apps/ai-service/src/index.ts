import express, { Request, Response } from 'express'
import config from './config/index.js'

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'ai-service',
    timestamp: new Date().toISOString(),
    config: {
      backendUrl: config.backendApi.baseUrl,
    },
  })
})

// AI Analysis endpoint (example)
app.post('/api/ai/analyze', (req: Request, res: Response) => {
  const { text } = req.body

  if (!text) {
    return res.status(config.responseConfig.validationErrorStatus).json({
      error: 'Text is required',
    })
  }

  // Placeholder AI analysis logic
  res.json({
    status: 'success',
    input: text,
    analysis: {
      sentiment: 'positive',
      keywords: text.split(' ').slice(0, 3),
      score: 0.85,
    },
    backendApiUrl: config.backendApi.baseUrl,
  })
})

// Error handling middleware
app.use((err: any, req: Request, res: Response) => {
  console.error('Error:', err)
  res.status(config.responseConfig.errorStatus).json({
    error: 'Internal server error',
    message: err.message,
  })
})

// Start server
const port = config.port
app.listen(port, () => {
  console.log(`🤖 AI Service running on port ${port}`)
  console.log(`📍 Health check: http://localhost:${port}/health`)
  console.log(`🔗 Backend API: ${config.backendApi.baseUrl}`)
  console.log(`📌 Environment: ${config.nodeEnv}`)
})

export default app
