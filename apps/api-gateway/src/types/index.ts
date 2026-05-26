import { Request } from 'express'

export interface RegisterDto {
  email: string
  password: string
  name?: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface JwtPayload {
  userId: string
  email: string
}

export interface AuthRequest extends Request {
  user?: JwtPayload
}

export interface CreateTodoDto {
  title: string
  description?: string
  priority?: string
  dueDate?: string
  aiGenerated?: boolean
}

export interface UpdateTodoDto {
  title?: string
  description?: string
  completed?: boolean
  priority?: string
  dueDate?: string
}
