import { Request, Response, NextFunction } from 'express'
import { ApiError } from './error.js'

export interface AuthRequest extends Request {
  user?: {
    userId: string
    email?: string
  }
}

// Middleware to verify JWT token from Authorization header
export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Missing or invalid authorization header')
  }

  const token = authHeader.slice(7)

  // Pass token to the backend service
  // The backend service will validate it
  req.headers.authorization = `Bearer ${token}`

  next()
}

// Middleware to require authentication on protected routes
export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required',
      timestamp: new Date().toISOString(),
    })
  }

  next()
}
