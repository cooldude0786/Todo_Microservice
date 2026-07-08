const API_BASE_URL = "";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // For client-side requests, we'll rely on Next-Auth session handling
    // API routes on the server will handle token passing

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
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
        error: error.message || "Network error occurred",
      };
    }
  }

  // Authentication methods
  async login(email: string, password: string) {
    return this.request<{ token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string) {
    return this.request<{ token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  }

  // Note: logout is now handled by Next-Auth's signOut function
  // This method is kept for compatibility but should not be used
  async logout() {
    console.warn("Warning: apiClient.logout() is deprecated. Use Next-Auth's signOut() instead.");
    return this.request<void>("/api/auth/logout", {
      method: "POST",
    });
  }

  // Task methods
  async getTasks() {
    return this.request<{ tasks: any[] }>("/tasks");
  }

  async createTask(title: string, description: string) {
    return this.request<any>("/tasks", {
      method: "POST",
      body: JSON.stringify({ title, description }),
    });
  }

  async updateTask(id: string, updates: Partial<{ title: string; description: string; completed: boolean }>) {
    return this.request<any>(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(id: string) {
    return this.request<void>(`/tasks/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();

export type { ApiResponse };