import { Request, Response } from 'express'

export const proxyRequest = async (
  req: Request,
  res: Response,
  targetUrl: string,
  basePath: string
): Promise<void> => {
  try {
    // Debug logs
    console.log('=== PROXY DEBUG ===')
    console.log('targetUrl:', targetUrl)
    console.log('basePath:', basePath)
    console.log('req.originalUrl:', req.originalUrl)
    console.log('req.path:', req.path)
    
    // Remove the gateway's base path and reconstruct with service's path
    const servicePath = req.originalUrl.replace(basePath, '/api')
    
    // For auth routes
    if (basePath === '/api/auth') {
      const authPath = req.originalUrl.replace('/api/auth', '/api/auth')
      const url = `${targetUrl}${authPath}`
      console.log('Final URL:', url)
      console.log('===================')
      
      const response = await fetch(url, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          ...(req.headers.authorization && { 
            'Authorization': req.headers.authorization 
          })
        },
        ...(req.method !== 'GET' && req.method !== 'HEAD' && {
          body: JSON.stringify(req.body)
        })
      })

      const data = await response.json()
      res.status(response.status).json(data)
      return
    }
    
    // For todo routes
    const todoPath = req.originalUrl.replace('/api/todos', '/api/todos')
    const url = `${targetUrl}${todoPath}`
    
    console.log('Final URL:', url)
    console.log('===================')
    
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization && { 
          'Authorization': req.headers.authorization 
        })
      },
      ...(req.method !== 'GET' && req.method !== 'HEAD' && {
        body: JSON.stringify(req.body)
      })
    })

    const data = await response.json()
    res.status(response.status).json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({ 
      error: 'Gateway error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}