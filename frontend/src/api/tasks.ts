import { apiClient } from '../lib/axios'
import type { CreateTaskRequest, TaskPriority, TaskResponse, UpdateTaskRequest } from '../types/task'

export interface GetTasksParams {
  priority?: TaskPriority
}

export async function getTasks(params: GetTasksParams = {}): Promise<TaskResponse[]> {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined),
  )
  const { data } = await apiClient.get<TaskResponse[]>('/tasks', { params: cleanParams })
  return data
}

export async function createTask(request: CreateTaskRequest): Promise<TaskResponse> {
  const { data } = await apiClient.post<TaskResponse>('/tasks', request)
  return data
}

export async function updateTask(id: string, request: UpdateTaskRequest): Promise<TaskResponse> {
  const { data } = await apiClient.put<TaskResponse>(`/tasks/${id}`, request)
  return data
}

export async function deleteTask(id: string): Promise<void> {
  await apiClient.delete(`/tasks/${id}`)
}
