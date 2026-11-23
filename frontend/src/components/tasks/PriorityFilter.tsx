import type { TaskPriority } from '../../types/task'
import { PRIORITY_LABELS } from '../../types/task'

interface PriorityFilterProps {
  value: TaskPriority | undefined
  onChange: (priority: TaskPriority | undefined) => void
}

const priorities: TaskPriority[] = ['high', 'medium', 'low']

export function PriorityFilter({ value, onChange }: PriorityFilterProps) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => onChange(undefined)}
        className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          value === undefined
            ? 'bg-primary text-white'
            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        すべて
      </button>
      {priorities.map((p) => (
        <button
          key={p}
          onClick={() => onChange(value === p ? undefined : p)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            value === p
              ? 'bg-primary text-white'
              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {PRIORITY_LABELS[p]}
        </button>
      ))}
    </div>
  )
}
