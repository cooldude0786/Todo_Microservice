import express ,{Router} from 'express'
import { register, login, verify } from '../controllers/auth.controllers'
import { authenticateToken } from '../middleware/auth.middleware'

const router: Router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/verify', authenticateToken, verify)

export default router
