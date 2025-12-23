import { Response } from 'express'
import { prisma } from '@todo-app/shared'
import { AuthRequest, CreateTodoDto } from '../types/index'

export const createTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Check if request body exists
    if (!req.body) {
      res.status(400).json({ error: 'Request body is required' })
      return
    }

    const { title, description, priority, dueDate, aiGenerated } = req.body as CreateTodoDto

    const userId = req.user!.userId

    // Check if userId exists
    if (!userId) {
      res.status(401).json({ error: 'User authentication required' })
      return
    }

    // Validate required fields
    if (!title) {
      res.status(400).json({ error: 'Title is required' })
      return
    }

    // Validate title length
    if (typeof title !== 'string' || title.trim().length === 0) {
      res.status(400).json({ error: 'Title must be a non-empty string' })
      return
    }

    if (title.length > 255) {
      res.status(400).json({ error: 'Title cannot exceed 255 characters' })
      return
    }

    // Validate description if provided
    if (description !== undefined && typeof description !== 'string') {
      res.status(400).json({ error: 'Description must be a string' })
      return
    }

    if (description && description.length > 1000) {
      res.status(400).json({ error: 'Description cannot exceed 1000 characters' })
      return
    }

    // Validate priority if provided
    const validPriorities = ['low', 'medium', 'high'];
    if (priority !== undefined && !validPriorities.includes(priority)) {
      res.status(400).json({ error: 'Priority must be one of: low, medium, high' })
      return
    }

    // Validate dueDate if provided
    if (dueDate) {
      if (typeof dueDate !== 'string') {
        res.status(400).json({ error: 'Due date must be a string in ISO format' })
        return
      }

      const parsedDate = new Date(dueDate);
      if (isNaN(parsedDate.getTime())) {
        res.status(400).json({ error: 'Invalid date format. Use ISO format (YYYY-MM-DD)' })
        return
      }
    }

    // Validate aiGenerated if provided
    if (aiGenerated !== undefined && typeof aiGenerated !== 'boolean') {
      res.status(400).json({ error: 'AI Generated flag must be a boolean' })
      return
    }

    // Sanitize inputs
    const sanitizedTitle = title.trim();
    const sanitizedDescription = description ? description.trim() : null;

    // Create todo
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
