import { useQuery } from '@tanstack/react-query'
import { getTasks } from '../api/tasks'
import type { TaskPriority } from '../types/task'

export function useTasks(priority?: TaskPriority) {
  return useQuery({
    queryKey: ['tasks', { priority }],
    queryFn: () => getTasks(priority ? { priority } : {}),
    staleTime: 30_000,
  })
}
