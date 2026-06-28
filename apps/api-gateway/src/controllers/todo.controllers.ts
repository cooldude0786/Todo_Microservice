import { Response } from 'express'
import { prisma } from '@todo-app/shared'
import { AuthRequest, CreateTodoDto, UpdateTodoDto } from '../types/index.js'

const isValidIsoDate = (value: string): boolean => {
  const parsedDate = new Date(value)
  return !isNaN(parsedDate.getTime())
}

const validateAndResolveGroupId = async (
  groupId: string | null | undefined,
  userId: string
): Promise<string | null | undefined> => {
  if (groupId === undefined) return undefined
  if (groupId === null || groupId.trim() === '') return null

  const group = await prisma.group.findFirst({
    where: { id: groupId, userId }
  })

  if (!group) {
    throw new Error('GROUP_NOT_FOUND')
  }

  return group.id
}

export const createTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.body) {
      res.status(400).json({ error: 'Request body is required' })
      return
    }

    const { title, description, priority, dueDate, aiGenerated, groupId } = req.body as CreateTodoDto
    const userId = req.user?.userId

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
      if (typeof dueDate !== 'string' || !isValidIsoDate(dueDate)) {
        res.status(400).json({ error: 'Invalid dueDate format. Use ISO format (YYYY-MM-DD)' })
        return
      }
    }

    if (aiGenerated !== undefined && typeof aiGenerated !== 'boolean') {
      res.status(400).json({ error: 'AI Generated flag must be a boolean' })
      return
    }

    if (groupId !== undefined && groupId !== null && typeof groupId !== 'string') {
      res.status(400).json({ error: 'groupId must be a string or null' })
      return
    }

    const sanitizedTitle = title.trim()
    const sanitizedDescription = description ? description.trim() : null

    let resolvedGroupId: string | null | undefined
    try {
      resolvedGroupId = await validateAndResolveGroupId(groupId, userId)
    } catch (error) {
      if ((error as Error).message === 'GROUP_NOT_FOUND') {
        res.status(400).json({ error: 'Group not found for current user' })
        return
      }
      throw error
    }

    const todo = await prisma.todo.create({
      data: {
        title: sanitizedTitle,
        description: sanitizedDescription,
        priority: priority || 'medium',
        dueDate: dueDate ? new Date(dueDate) : null,
        aiGenerated: aiGenerated || false,
        userId,
        groupId: resolvedGroupId ?? null
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
    const userId = req.user?.userId
    const view = req.query.view

    if (!userId) {
      res.status(401).json({ error: 'User authentication required' })
      return
    }

    const todos = await prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { group: true }
    })

    if (view === 'grouped') {
      const groupedMap = new Map<string, { group: { id: string; name: string }; todos: typeof todos }>()
      const ungrouped: typeof todos = []

      for (const todo of todos) {
        if (!todo.group) {
          ungrouped.push(todo)
          continue
        }

        const existing = groupedMap.get(todo.group.id)
        if (existing) {
          existing.todos.push(todo)
        } else {
          groupedMap.set(todo.group.id, {
            group: { id: todo.group.id, name: todo.group.name },
            todos: [todo]
          })
        }
      }

      res.json({
        total: todos.length,
        groups: Array.from(groupedMap.values()),
        ungrouped
      })
      return
    }

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
    const userId = req.user?.userId

    if (!userId) {
      res.status(401).json({ error: 'User authentication required' })
      return
    }

    const todo = await prisma.todo.findFirst({
      where: { id, userId },
      include: { group: true }
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
    const userId = req.user?.userId
    const updates = req.body as UpdateTodoDto

    if (!userId) {
      res.status(401).json({ error: 'User authentication required' })
      return
    }

    const existingTodo = await prisma.todo.findFirst({
      where: { id, userId }
    })

    if (!existingTodo) {
      res.status(404).json({ error: 'Todo not found' })
      return
    }

    if (updates.dueDate !== undefined && updates.dueDate !== null) {
      if (typeof updates.dueDate !== 'string' || !isValidIsoDate(updates.dueDate)) {
        res.status(400).json({ error: 'Invalid dueDate format. Use ISO format (YYYY-MM-DD)' })
        return
      }
    }

    if (updates.groupId !== undefined && updates.groupId !== null && typeof updates.groupId !== 'string') {
      res.status(400).json({ error: 'groupId must be a string or null' })
      return
    }

    let resolvedGroupId: string | null | undefined
    try {
      resolvedGroupId = await validateAndResolveGroupId(updates.groupId, userId)
    } catch (error) {
      if ((error as Error).message === 'GROUP_NOT_FOUND') {
        res.status(400).json({ error: 'Group not found for current user' })
        return
      }
      throw error
    }

    const updateData: any = {}
    if (updates.title !== undefined) updateData.title = updates.title
    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.completed !== undefined) updateData.completed = updates.completed
    if (updates.priority !== undefined) updateData.priority = updates.priority
    if (updates.dueDate !== undefined) {
      updateData.dueDate = updates.dueDate ? new Date(updates.dueDate) : null
    }
    if (resolvedGroupId !== undefined) {
      updateData.groupId = resolvedGroupId
    }

    const todo = await prisma.todo.update({
      where: { id },
      data: updateData,
      include: { group: true }
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
    const userId = req.user?.userId

    if (!userId) {
      res.status(401).json({ error: 'User authentication required' })
      return
    }

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
