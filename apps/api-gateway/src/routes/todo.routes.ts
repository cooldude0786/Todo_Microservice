import { Router, Request, Response } from 'express'
import { proxyRequest } from '../utils/proxy.js'
import dotenv from 'dotenv'
dotenv.config()
const router: Router = Router()

const TODO_CREATE_SERVICE = process.env.TODO_CREATE_SERVICE_URL!
const TODO_READ_SERVICE = process.env.TODO_READ_SERVICE_URL!
const TODO_UPDATE_SERVICE = process.env.TODO_UPDATE_SERVICE_URL!
const TODO_DELETE_SERVICE = process.env.TODO_DELETE_SERVICE_URL!

router.post('/', (req: Request, res: Response) => {
  proxyRequest(req, res, TODO_CREATE_SERVICE, '/api/todos')
})

router.get('/', (req: Request, res: Response) => {
  proxyRequest(req, res, TODO_READ_SERVICE, '/api/todos')
})

router.get('/:id', (req: Request, res: Response) => {
  proxyRequest(req, res, TODO_READ_SERVICE, '/api/todos')
})

router.put('/:id', (req: Request, res: Response) => {
  proxyRequest(req, res, TODO_UPDATE_SERVICE, '/api/todos')
})

router.patch('/:id', (req: Request, res: Response) => {
  proxyRequest(req, res, TODO_UPDATE_SERVICE, '/api/todos')
})

router.delete('/:id', (req: Request, res: Response) => {
  proxyRequest(req, res, TODO_DELETE_SERVICE, '/api/todos')
})

export default router