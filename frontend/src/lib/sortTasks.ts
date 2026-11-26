import type { TaskResponse } from '../types/task'

export type SortKey = 'priority' | 'dueDate' | 'createdAt'

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 }

export function sortTasks(tasks: TaskResponse[], key: SortKey): TaskResponse[] {
  return [...tasks].sort((a, b) => {
    switch (key) {
      case 'priority': {
        const pa = a.priority != null ? (PRIORITY_ORDER[a.priority] ?? 3) : 3
        const pb = b.priority != null ? (PRIORITY_ORDER[b.priority] ?? 3) : 3
        return pa - pb
      }
      case 'dueDate': {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return a.dueDate.localeCompare(b.dueDate)
      }
      case 'createdAt':
        return b.createdAt.localeCompare(a.createdAt)
    }
  })
}

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'priority', label: '優先度順' },
  { value: 'dueDate', label: '期日順' },
  { value: 'createdAt', label: '作成日順（新しい順）' },
]
