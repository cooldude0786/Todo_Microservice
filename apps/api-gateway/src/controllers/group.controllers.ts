import { Response } from 'express'
import { prisma } from '@todo-app/shared'
import { AuthRequest, CreateGroupDto, UpdateGroupDto } from '../types/index.js'

const normalizeName = (name: string): string => name.trim()

export const createGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId
    if (!userId) {
      res.status(401).json({ error: 'User authentication required' })
      return
    }

    const { name } = req.body as CreateGroupDto
    if (!name || typeof name !== 'string' || normalizeName(name).length === 0) {
      res.status(400).json({ error: 'Group name is required' })
      return
    }

    const trimmedName = normalizeName(name)
    if (trimmedName.length > 100) {
      res.status(400).json({ error: 'Group name cannot exceed 100 characters' })
      return
    }

    const existing = await prisma.group.findFirst({
      where: { userId, name: trimmedName }
    })

    if (existing) {
      res.status(409).json({ error: 'Group name already exists' })
      return
    }

    const group = await prisma.group.create({
      data: { name: trimmedName, userId }
    })

    res.status(201).json({ message: 'Group created successfully', group })
  } catch (error) {
    console.error('Create group error:', error)
    res.status(500).json({ error: 'Failed to create group' })
  }
}

export const getAllGroups = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId
    if (!userId) {
      res.status(401).json({ error: 'User authentication required' })
      return
    }

    const groups = await prisma.group.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ count: groups.length, groups })
  } catch (error) {
    console.error('Get groups error:', error)
    res.status(500).json({ error: 'Failed to fetch groups' })
  }
}

export const updateGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId
    const { id } = req.params
    if (!userId) {
      res.status(401).json({ error: 'User authentication required' })
      return
    }

    const existing = await prisma.group.findFirst({
      where: { id, userId }
    })
    if (!existing) {
      res.status(404).json({ error: 'Group not found' })
      return
    }

    const updates = req.body as UpdateGroupDto
    const updateData: { name?: string } = {}

    if (updates.name !== undefined) {
      if (typeof updates.name !== 'string' || normalizeName(updates.name).length === 0) {
        res.status(400).json({ error: 'Group name must be a non-empty string' })
        return
      }
      const trimmedName = normalizeName(updates.name)
      if (trimmedName.length > 100) {
        res.status(400).json({ error: 'Group name cannot exceed 100 characters' })
        return
      }

      const duplicate = await prisma.group.findFirst({
        where: {
          userId,
          name: trimmedName,
          id: { not: id }
        }
      })

      if (duplicate) {
        res.status(409).json({ error: 'Group name already exists' })
        return
      }

      updateData.name = trimmedName
    }

    const group = await prisma.group.update({
      where: { id },
      data: updateData
    })

    res.json({ message: 'Group updated successfully', group })
  } catch (error) {
    console.error('Update group error:', error)
    res.status(500).json({ error: 'Failed to update group' })
  }
}

export const deleteGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId
    const { id } = req.params
    if (!userId) {
      res.status(401).json({ error: 'User authentication required' })
      return
    }

    const existing = await prisma.group.findFirst({
      where: { id, userId }
    })
    if (!existing) {
      res.status(404).json({ error: 'Group not found' })
      return
    }

    await prisma.todo.updateMany({
      where: { groupId: id, userId },
      data: { groupId: null }
    })

    await prisma.group.delete({ where: { id } })

    res.json({ message: 'Group deleted successfully', deletedId: id })
  } catch (error) {
    console.error('Delete group error:', error)
    res.status(500).json({ error: 'Failed to delete group' })
  }
}
