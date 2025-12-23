import { Router, Request, Response } from 'express'
import { proxyRequest } from '../utils/proxy.js'
await process.loadEnvFile();
const router: Router = Router()
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL!

router.post('/register', (req: Request, res: Response) => {
  proxyRequest(req, res, AUTH_SERVICE, '/api/auth')
})

router.post('/login', (req: Request, res: Response) => {
  proxyRequest(req, res, AUTH_SERVICE, '/api/auth')
})

router.get('/verify', (req: Request, res: Response) => {
  proxyRequest(req, res, AUTH_SERVICE, '/api/auth')
})

export default router