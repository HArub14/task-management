export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'high' | 'medium' | 'low'

export interface CreateTaskRequest {
  title: string
  description?: string
  priority?: TaskPriority
  dueDate?: string
}

export interface TaskResponse {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority | null
  dueDate: string | null
  assigneeId: string | null
  assigneeName: string | null
  createdById: string
  createdAt: string
  updatedAt: string
}

export const BOARD_COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: 'todo', label: '未着手' },
  { status: 'in_progress', label: '進行中' },
  { status: 'done', label: '完了' },
]

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: '未着手',
  in_progress: '進行中',
  done: '完了',
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: '高',
  medium: '中',
  low: '低',
}
