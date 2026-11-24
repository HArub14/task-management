import type { TaskPriority, TaskStatus } from '../../types/task'
import { STATUS_LABELS, PRIORITY_LABELS } from '../../types/task'

type BadgeVariant = TaskStatus | TaskPriority

const variantStyles: Record<BadgeVariant, string> = {
  todo: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-100 text-blue-700',
  done: 'bg-green-50 text-green-600',
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-gray-100 text-gray-500',
}

const variantLabels: Record<BadgeVariant, string> = {
  ...STATUS_LABELS,
  ...PRIORITY_LABELS,
}

interface BadgeProps {
  variant: BadgeVariant
}

export function Badge({ variant }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${variantStyles[variant]}`}
    >
      {variantLabels[variant]}
    </span>
  )
}
