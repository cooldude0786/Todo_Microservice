import { Response } from 'express'
import { prisma } from '@todo-app/shared'
import { AuthRequest, UpdateTodoDto } from '../types/index.js'

export const updateTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user!.userId
    const updates = req.body as UpdateTodoDto

    // Check if todo exists and belongs to user
    const existingTodo = await prisma.todo.findFirst({
      where: { id, userId }
    })

    if (!existingTodo) {
      res.status(404).json({ error: 'Todo not found' })
      return
    }

    // Prepare update data
    const updateData: any = {}
    
    if (updates.title !== undefined) updateData.title = updates.title
    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.completed !== undefined) updateData.completed = updates.completed
    if (updates.priority !== undefined) updateData.priority = updates.priority
    if (updates.dueDate !== undefined) {
      updateData.dueDate = updates.dueDate ? new Date(updates.dueDate) : null
    }

    // Update todo
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