import jwt, { SignOptions } from 'jsonwebtoken'
import { JwtPayload } from '../types/index.js'

export const generateToken = (payload: JwtPayload): string => {
  const options = {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  } as SignOptions

  return jwt.sign(payload as string | object | Buffer, process.env.JWT_SECRET! as jwt.Secret, options)
}

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET! as jwt.Secret) as JwtPayload
  } catch (error) {
    return null
  }
}
