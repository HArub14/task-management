import { apiClient } from '../lib/axios'
import type { CreateTaskRequest, TaskPriority, TaskResponse } from '../types/task'

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
