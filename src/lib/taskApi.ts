// lib/taskApi.ts
import { apiClient } from './api';

// ─── Types ─────────────────────────────────────────────────────────────

export interface Employee {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  role: string;
  avatar_url: string | null;
  phone: string | null;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  assignee_id: number | null;
  assignee_name: string | null;
  assignee_email: string | null;
  assignee_role: string | null;
  assignee_avatar: string | null;
  creator_name: string | null;
  creator_avatar: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string | null;
  estimated_hours: number | null;
  actual_hours: number;
  created_by: number | null;
  created_at: string;
  updated_at: string;
  comments?: TaskComment[];
}

export interface TaskComment {
  id: number;
  task_id: number;
  user_id: number;
  user_name: string;
  user_avatar: string | null;
  user_role: string;
  comment: string;
  created_at: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  review: number;
  todo: number;
  urgent: number;
  overdue: number;
  completionRate: number;
}

export interface TaskFilters {
  search?: string;
  status?: string;
  priority?: string;
  assignee_id?: string;
  startDate?: string;
  endDate?: string;
  ignoreDate?: boolean;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  assignee_id?: number | null;
  priority?: TaskPriority;
  status?: TaskStatus;
  due_date?: string | null;
  estimated_hours?: number | null;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  assignee_id?: number | null;
  priority?: TaskPriority;
  status?: TaskStatus;
  due_date?: string | null;
  estimated_hours?: number | null;
  actual_hours?: number;
}

// ─── API Methods ────────────────────────────────────────────────────────

export const taskApi = {
  // Get list of all active employees for task assignment
  getEmployees: (): Promise<Employee[]> =>
    apiClient.get<Employee[]>('/tasks/employees'),

  // Get task statistics
  getStats: (): Promise<TaskStats> =>
    apiClient.get<TaskStats>('/tasks/stats'),

  // Get all tasks with optional filters
  getTasks: (filters?: TaskFilters): Promise<Task[]> => {
    const params: Record<string, string> = {};
    if (filters?.search) params.search = filters.search;
    if (filters?.status && filters.status !== 'all') params.status = filters.status;
    if (filters?.priority && filters.priority !== 'all') params.priority = filters.priority;
    if (filters?.assignee_id && filters.assignee_id !== 'all') params.assignee_id = filters.assignee_id;
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;
    if (filters?.ignoreDate) params.ignoreDate = String(filters.ignoreDate);
    return apiClient.get<Task[]>('/tasks', { params });
  },

  // Get single task details with comments
  getTaskById: (id: number): Promise<Task> =>
    apiClient.get<Task>(`/tasks/${id}`),

  // Create a new task
  createTask: (payload: CreateTaskPayload): Promise<{ taskId: number }> =>
    apiClient.post<{ taskId: number }>('/tasks', payload),

  // Update an existing task
  updateTask: (id: number, payload: UpdateTaskPayload): Promise<void> =>
    apiClient.put<void>(`/tasks/${id}`, payload),

  // Delete a task
  deleteTask: (id: number): Promise<void> =>
    apiClient.delete<void>(`/tasks/${id}`),

  // Add a comment to a task
  addComment: (taskId: number, comment: string): Promise<{ commentId: number }> =>
    apiClient.post<{ commentId: number }>(`/tasks/${taskId}/comments`, { comment }),
};
