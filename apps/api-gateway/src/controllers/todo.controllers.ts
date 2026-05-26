import { Response } from 'express'
import { prisma } from '@todo-app/shared'
import { AuthRequest, CreateTodoDto, UpdateTodoDto } from '../types/index.js'

export const createTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.body) {
      res.status(400).json({ error: 'Request body is required' })
      return
    }

    const { title, description, priority, dueDate, aiGenerated } = req.body as CreateTodoDto
    const userId = req.user!.userId

    if (!userId) {
      res.status(401).json({ error: 'User authentication required' })
      return
    }

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      res.status(400).json({ error: 'Title must be a non-empty string' })
      return
    }

    if (title.length > 255) {
      res.status(400).json({ error: 'Title cannot exceed 255 characters' })
      return
    }

    if (description !== undefined && typeof description !== 'string') {
      res.status(400).json({ error: 'Description must be a string' })
      return
    }

    if (description && description.length > 1000) {
      res.status(400).json({ error: 'Description cannot exceed 1000 characters' })
      return
    }

    const validPriorities = ['low', 'medium', 'high']
    if (priority !== undefined && !validPriorities.includes(priority)) {
      res.status(400).json({ error: 'Priority must be one of: low, medium, high' })
      return
    }

    if (dueDate !== undefined && dueDate !== null) {
      if (typeof dueDate !== 'string') {
        res.status(400).json({ error: 'Due date must be a string in ISO format' })
        return
      }

      const parsedDate = new Date(dueDate)
      if (isNaN(parsedDate.getTime())) {
        res.status(400).json({ error: 'Invalid date format. Use ISO format (YYYY-MM-DD)' })
        return
      }
    }

    if (aiGenerated !== undefined && typeof aiGenerated !== 'boolean') {
      res.status(400).json({ error: 'AI Generated flag must be a boolean' })
      return
    }

    const sanitizedTitle = title.trim()
    const sanitizedDescription = description ? description.trim() : null

    const todo = await prisma.todo.create({
      data: {
        title: sanitizedTitle,
        description: sanitizedDescription,
        priority: priority || 'medium',
        dueDate: dueDate ? new Date(dueDate) : null,
        aiGenerated: aiGenerated || false,
        userId
      }
    })

    res.status(201).json({
      message: 'Todo created successfully',
      todo
    })
  } catch (error) {
    console.error('Create todo error:', error)
    res.status(500).json({ error: 'Failed to create todo' })
  }
}

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

export const getTodoById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user!.userId

    const todo = await prisma.todo.findFirst({
      where: {
        id,
        userId
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

export const updateTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user!.userId
    const updates = req.body as UpdateTodoDto

    const existingTodo = await prisma.todo.findFirst({
      where: { id, userId }
    })

    if (!existingTodo) {
      res.status(404).json({ error: 'Todo not found' })
      return
    }

    if (updates.dueDate !== undefined && updates.dueDate !== null) {
      if (typeof updates.dueDate !== 'string') {
        res.status(400).json({ error: 'Due date must be a string in ISO format' })
        return
      }

      const parsedDate = new Date(updates.dueDate)
      if (isNaN(parsedDate.getTime())) {
        res.status(400).json({ error: 'Invalid date format. Use ISO format (YYYY-MM-DD)' })
        return
      }
    }

    const updateData: any = {}
    if (updates.title !== undefined) updateData.title = updates.title
    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.completed !== undefined) updateData.completed = updates.completed
    if (updates.priority !== undefined) updateData.priority = updates.priority
    if (updates.dueDate !== undefined) {
      updateData.dueDate = updates.dueDate ? new Date(updates.dueDate) : null
    }

    const todo = await prisma.todo.update({
      where: { id },
      data: updateData
    })

    res.json({
      message: 'Todo updated successfully',
      todo
    })
  } catch (error) {
    console.error('Update todo error:', error)
    res.status(500).json({ error: 'Failed to update todo' })
  }
}

export const deleteTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user!.userId

    const existingTodo = await prisma.todo.findFirst({
      where: { id, userId }
    })

    if (!existingTodo) {
      res.status(404).json({ error: 'Todo not found' })
      return
    }

    await prisma.todo.delete({
      where: { id }
    })

    res.json({
      message: 'Todo deleted successfully',
      deletedId: id
    })
  } catch (error) {
    console.error('Delete todo error:', error)
    res.status(500).json({ error: 'Failed to delete todo' })
  }
}
