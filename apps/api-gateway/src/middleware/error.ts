import { Request, Response, NextFunction } from 'express'

interface ValidationError {
  field: string
  message: string
}

interface ApiErrorResponse {
  status: 'error'
  message: string
  errors?: ValidationError[]
  timestamp: string
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: ValidationError[]
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[Error Handler] ${err.message}`, err)

  if (err instanceof ApiError) {
    const response: ApiErrorResponse = {
      status: 'error',
      message: err.message,
      timestamp: new Date().toISOString(),
    }

    if (err.errors) {
      response.errors = err.errors
    }

    return res.status(err.statusCode).json(response)
  }

  // Handle unknown errors
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    timestamp: new Date().toISOString(),
  })
}

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response: ApiErrorResponse = {
    status: 'error',
    message: `Route not found: ${req.method} ${req.path}`,
    timestamp: new Date().toISOString(),
  }

  res.status(404).json(response)
}
