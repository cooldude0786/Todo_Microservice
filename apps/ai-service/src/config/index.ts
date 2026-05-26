import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Backend API Configuration
  backendApi: {
    baseUrl: process.env.BACKEND_API_URL || 'http://localhost:4000',
    
    // Auth Endpoints
    auth: {
      register: '/api/auth/register',
      login: '/api/auth/login',
      verify: '/api/auth/verify',
    },
    
    // Todo Endpoints
    todos: {
      create: '/api/todos',
      getAll: '/api/todos',
      getById: (id: string) => `/api/todos/${id}`,
      update: (id: string) => `/api/todos/${id}`,
      delete: (id: string) => `/api/todos/${id}`,
    },
  },

  // Request/Response Configuration
  requestConfig: {
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'AI-Service/1.0',
    },
  },

  responseConfig: {
    successStatus: 200,
    errorStatus: 500,
    validationErrorStatus: 400,
    unauthorizedStatus: 401,
    notFoundStatus: 404,
  },
}

export default config
