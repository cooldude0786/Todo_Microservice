import { task, taskGroup } from './types';
import { getApiBaseUrl } from './api-url';

const API_BASE_URL = getApiBaseUrl();

export type CreateTodoPayload = {
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  groupId?: string | null;
};

export type UpdateTodoPayload = Partial<{
  title: string;
  description: string | null;
  completed: boolean;
  priority: string;
  dueDate: string | null;
  groupId: string | null;
}>;

const withAuth = (accessToken: string | undefined): HeadersInit => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${accessToken || ''}`,
});

export const getAllTodos = async (accessToken: string | undefined): Promise<task[]> => {
  const response = await fetch(`${API_BASE_URL}/api/todos`, {
    method: 'GET',
    headers: withAuth(accessToken),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return result.todos || result;
};

export const getTodoById = async (id: string, accessToken: string | undefined): Promise<task> => {
  const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
    method: 'GET',
    headers: withAuth(accessToken),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return result.todo || result.data || result;
};

export const createTodo = async (todoData: CreateTodoPayload, accessToken: string | undefined): Promise<task> => {
  const response = await fetch(`${API_BASE_URL}/api/todos`, {
    method: 'POST',
    headers: withAuth(accessToken),
    body: JSON.stringify(todoData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return result.todo || result.data || result;
};

export const updateTodo = async (id: string, todoData: UpdateTodoPayload, accessToken: string | undefined): Promise<task> => {
  const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
    method: 'PUT',
    headers: withAuth(accessToken),
    body: JSON.stringify(todoData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return result.todo || result.data || result;
};

export const deleteTodo = async (id: string, accessToken: string | undefined): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
    method: 'DELETE',
    headers: withAuth(accessToken),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

export const getAllGroups = async (accessToken: string | undefined): Promise<taskGroup[]> => {
  const response = await fetch(`${API_BASE_URL}/api/groups`, {
    method: 'GET',
    headers: withAuth(accessToken),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return result.groups || result;
};

export const createGroup = async (name: string, accessToken: string | undefined): Promise<taskGroup> => {
  const response = await fetch(`${API_BASE_URL}/api/groups`, {
    method: 'POST',
    headers: withAuth(accessToken),
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return result.group || result.data || result;
};
