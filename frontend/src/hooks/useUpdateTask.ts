import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTask } from '../api/tasks'
import type { UpdateTaskRequest } from '../types/task'

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateTaskRequest }) =>
      updateTask(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
