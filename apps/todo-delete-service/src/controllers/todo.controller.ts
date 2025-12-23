import { Response } from 'express'
import { prisma } from '@todo-app/shared'
import { AuthRequest } from '../types/index.js'

export const deleteTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user!.userId

    // Check if todo exists and belongs to user
    const existingTodo = await prisma.todo.findFirst({
      where: { id, userId }
    })

    if (!existingTodo) {
      res.status(404).json({ error: 'Todo not found' })
      return
    }

    // Delete todo
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