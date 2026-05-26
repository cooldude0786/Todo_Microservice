import express, { Router } from 'express'
import { register, login, verify } from '../controllers/auth.controllers.js'
import { authenticateToken } from '../middleware/auth.middleware.js'

const router: Router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/verify', authenticateToken, verify)

export default router