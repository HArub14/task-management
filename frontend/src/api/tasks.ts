import { apiClient } from '../lib/axios'
import type { TaskPriority, TaskResponse } from '../types/task'

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
