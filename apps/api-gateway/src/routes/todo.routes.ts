import express, { Router } from 'express'
import {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
} from '../controllers/todo.controllers.js'
import { authenticateToken } from '../middleware/auth.middleware.js'

const router: Router = express.Router()

router.post('/', authenticateToken, createTodo)
router.get('/', authenticateToken, getAllTodos)
router.get('/:id', authenticateToken, getTodoById)
router.put('/:id', authenticateToken, updateTodo)
router.patch('/:id', authenticateToken, updateTodo)
router.delete('/:id', authenticateToken, deleteTodo)

export default router