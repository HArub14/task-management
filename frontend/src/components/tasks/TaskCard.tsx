import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { TaskResponse } from '../../types/task'
import { Badge } from '../ui/Badge'
import { EditTaskModal } from './EditTaskModal'

interface TaskCardProps {
  task: TaskResponse
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${year}年${month}月${day}日`
}

export function TaskCard({ task }: TaskCardProps) {
  const [showEdit, setShowEdit] = useState(false)

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  })

  const style = { transform: CSS.Translate.toString(transform) }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => !isDragging && setShowEdit(true)}
        className={`mb-2 cursor-grab rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all hover:border-primary hover:shadow-md active:cursor-grabbing ${isDragging ? 'opacity-50 shadow-lg' : ''}`}
      >
        <p className="mb-2 line-clamp-2 text-sm font-semibold text-gray-800">{task.title}</p>
        <div className="flex flex-wrap items-center gap-1.5">
          {task.priority && <Badge variant={task.priority} />}
        </div>
        {task.dueDate && (
          <p className="mt-2 text-xs text-gray-400">{formatDate(task.dueDate)}</p>
        )}
      </div>

      {showEdit && <EditTaskModal task={task} onClose={() => setShowEdit(false)} />}
    </>
  )
}
