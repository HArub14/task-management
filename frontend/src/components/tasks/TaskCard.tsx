import type { TaskResponse } from '../../types/task'
import { Badge } from '../ui/Badge'

interface TaskCardProps {
  task: TaskResponse
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${year}年${month}月${day}日`
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="mb-2 cursor-pointer rounded-lg border border-gray-200 bg-white p-3 shadow-sm hover:border-primary hover:shadow-md transition-all">
      <p className="mb-2 line-clamp-2 text-sm font-semibold text-gray-800">{task.title}</p>
      <div className="flex flex-wrap items-center gap-1.5">
        {task.priority && <Badge variant={task.priority} />}
      </div>
      {task.dueDate && (
        <p className="mt-2 text-xs text-gray-400">{formatDate(task.dueDate)}</p>
      )}
    </div>
  )
}
