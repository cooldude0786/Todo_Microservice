import { Response } from 'express'
import { prisma } from '@todo-app/shared'
import { AuthRequest } from '../types/index.js'

// Get all todos for the authenticated user
export const getAllTodos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId

    const todos = await prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    res.json({
      count: todos.length,
      todos
    })
  } catch (error) {
    console.error('Get todos error:', error)
    res.status(500).json({ error: 'Failed to fetch todos' })
  }
}

// Get a single todo by ID
export const getTodoById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    // const userId = req.user!.userId

    const todo = await prisma.todo.findFirst({
      where: { 
        id,
        // userId // Ensure user can only access their own todos
      }
    })

    if (!todo) {
      res.status(404).json({ error: 'Todo not found' })
      return
    }

    res.json({ todo })
  } catch (error) {
    console.error('Get todo error:', error)
    res.status(500).json({ error: 'Failed to fetch todo' })
  }
}