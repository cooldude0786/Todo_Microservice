import { getServerSession } from 'next-auth/next';
import { authOptions } from '../app/api/auth/[...nextauth]/route';
import { ExtendedSession } from '../app/types/next-auth';
import { getApiBaseUrl } from './api-url';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ServerApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  private async authenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Get the current session
    const session = await getServerSession(authOptions) as ExtendedSession | null;

    if (!session || !session.accessToken) {
      return {
        success: false,
        error: 'Unauthorized: No valid session found',
      };
    }

    const token = session.accessToken;

    const config: RequestInit = {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);

      if (!response.ok) {
        const errorData = await response.text();
        return {
          success: false,
          error: errorData || `HTTP error! status: ${response.status}`,
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error occurred',
      };
    }
  }

  // Task methods
  async getTasks() {
    return this.authenticatedRequest<{ tasks: any[] }>('/api/tasks');
  }

  async createTask(title: string, description: string) {
    return this.authenticatedRequest<any>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    });
  }

  async updateTask(id: string, updates: Partial<{ title: string; description: string; completed: boolean }>) {
    return this.authenticatedRequest<any>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(id: string) {
    return this.authenticatedRequest<void>(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  }
}

export const serverApiClient = new ServerApiClient(getApiBaseUrl());
export type { ApiResponse };