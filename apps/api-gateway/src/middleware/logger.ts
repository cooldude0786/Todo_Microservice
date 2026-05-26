import { Request, Response, NextFunction } from 'express'

export interface RequestLog {
  timestamp: string
  method: string
  path: string
  statusCode: number
  duration: number
  ip: string
}

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now()
  const ip = req.ip || req.socket.remoteAddress || 'unknown'

  // Capture response status
  const originalSend = res.send
  res.send = function (data: any) {
    const duration = Date.now() - startTime

    const log: RequestLog = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: duration,
      ip: ip,
    }

    // Log with color coding based on status code
    const statusColor =
      res.statusCode >= 500 ? '🔴' : res.statusCode >= 400 ? '🟡' : '🟢'

    console.log(
      `${statusColor} [${log.timestamp}] ${log.method} ${log.path} - ${log.statusCode} (${log.duration}ms)`
    )

    // Store log in request object for debugging
    ;(req as any).log = log

    return originalSend.call(this, data)
  }

  next()
}

export const requestLoggerJson = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now()
  const ip = req.ip || req.socket.remoteAddress || 'unknown'

  // Capture response status
  const originalJson = res.json
  res.json = function (data: any) {
    const duration = Date.now() - startTime

    const log: RequestLog = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: duration,
      ip: ip,
    }

    // Log structured JSON
    console.log(JSON.stringify(log))

    // Store log in request object for debugging
    ;(req as any).log = log

    return originalJson.call(this, data)
  }

  next()
}
