import express, { Router } from 'express'
import { authenticateToken } from '../middleware/auth.middleware.js'
import {
  createGroup,
  getAllGroups,
  updateGroup,
  deleteGroup
} from '../controllers/group.controllers.js'

const router: Router = express.Router()

router.post('/', authenticateToken, createGroup)
router.get('/', authenticateToken, getAllGroups)
router.patch('/:id', authenticateToken, updateGroup)
router.delete('/:id', authenticateToken, deleteGroup)

export default router
