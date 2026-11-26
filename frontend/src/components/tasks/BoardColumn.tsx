import { useDroppable } from '@dnd-kit/core'
import type { TaskResponse, TaskStatus } from '../../types/task'
import { EmptyState } from '../ui/EmptyState'
import { TaskCard } from './TaskCard'

interface BoardColumnProps {
  title: string
  status: TaskStatus
  tasks: TaskResponse[]
}

const columnAccent: Record<TaskStatus, string> = {
  todo: 'bg-gray-100',
  in_progress: 'bg-blue-50',
  done: 'bg-green-50',
}

const columnAccentOver: Record<TaskStatus, string> = {
  todo: 'bg-gray-200',
  in_progress: 'bg-blue-100',
  done: 'bg-green-100',
}

export function BoardColumn({ title, status, tasks }: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      className={`flex min-w-[280px] flex-1 flex-col rounded-xl p-3 transition-colors ${isOver ? columnAccentOver[status] : columnAccent[status]}`}
    >
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-sm font-bold text-gray-700">{title}</h2>
        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
          {tasks.length}
        </span>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
        {tasks.length === 0 ? (
          <EmptyState />
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  )
}
