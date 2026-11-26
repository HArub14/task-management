import { useMemo, useState } from 'react'
import type { TaskPriority, TaskResponse, TaskStatus } from '../../types/task'
import { PRIORITY_LABELS } from '../../types/task'
import { useTasks } from '../../hooks/useTasks'
import { PriorityFilter } from './PriorityFilter'
import { CreateTaskModal } from './CreateTaskModal'
import { EditTaskModal } from './EditTaskModal'
import { sortTasks, SORT_OPTIONS } from '../../lib/sortTasks'
import type { SortKey } from '../../lib/sortTasks'

const PRIORITY_BADGE: Record<TaskPriority, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
}

const STATUS_HEADER: Record<TaskStatus, { label: string; style: string }> = {
  todo: { label: '未着手', style: 'bg-gray-100 text-gray-600' },
  in_progress: { label: '進行中', style: 'bg-blue-50 text-blue-700' },
  done: { label: '完了', style: 'bg-green-50 text-green-700' },
}

const STATUS_ORDER: TaskStatus[] = ['todo', 'in_progress', 'done']

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  const [year, month, day] = dateStr.split('-')
  return `${year}/${month}/${day}`
}

export function TaskListPage() {
  const [priority, setPriority] = useState<TaskPriority | undefined>()
  const [sortKey, setSortKey] = useState<SortKey>('priority')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTask, setEditingTask] = useState<TaskResponse | null>(null)
  const { data: tasks = [], isLoading, isError } = useTasks(priority)

  const groupedTasks = useMemo(
    () =>
      STATUS_ORDER.reduce<Record<TaskStatus, TaskResponse[]>>(
        (acc, status) => {
          acc[status] = sortTasks(
            tasks.filter((t) => t.status === status),
            sortKey,
          )
          return acc
        },
        { todo: [], in_progress: [], done: [] },
      ),
    [tasks, sortKey],
  )

  return (
    <main className="flex h-[calc(100vh-56px)] flex-col overflow-hidden">
      <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <h1 className="text-lg font-bold text-gray-800">タスク一覧</h1>
        <div className="flex items-center gap-3">
          <label htmlFor="sort-select" className="sr-only">並び替え</label>
          <select
            id="sort-select"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <PriorityFilter value={priority} onChange={setPriority} />
          <button
            onClick={() => setShowCreateModal(true)}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            + タスク追加
          </button>
        </div>
      </div>

      {showCreateModal && <CreateTaskModal onClose={() => setShowCreateModal(false)} />}
      {editingTask && <EditTaskModal task={editingTask} onClose={() => setEditingTask(null)} />}

      <div className="flex-1 overflow-auto px-6 py-4">
        {isLoading && (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
        )}

        {isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            タスクの取得に失敗しました。バックエンドが起動しているか確認してください。
          </div>
        )}

        {!isLoading && !isError && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">タイトル</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">優先度</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">期日</th>
                </tr>
              </thead>
              <tbody>
                {STATUS_ORDER.map((status) => {
                  const { label, style } = STATUS_HEADER[status]
                  const statusTasks = groupedTasks[status]
                  return (
                    <>
                      <tr key={`header-${status}`}>
                        <td colSpan={3} className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide ${style}`}>
                          {label}
                          <span className="ml-2 rounded-full bg-white/60 px-1.5 py-0.5 text-xs font-medium">
                            {statusTasks.length}
                          </span>
                        </td>
                      </tr>
                      {statusTasks.length === 0 ? (
                        <tr key={`empty-${status}`} className="border-t border-gray-100">
                          <td colSpan={3} className="px-4 py-3 text-sm text-gray-400">
                            タスクなし
                          </td>
                        </tr>
                      ) : (
                        statusTasks.map((task) => (
                          <tr
                            key={task.id}
                            onClick={() => setEditingTask(task)}
                            className="cursor-pointer border-t border-gray-100 transition-colors hover:bg-blue-50"
                          >
                            <td className="px-4 py-3 font-medium text-gray-800">{task.title}</td>
                            <td className="px-4 py-3">
                              {task.priority ? (
                                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_BADGE[task.priority]}`}>
                                  {PRIORITY_LABELS[task.priority]}
                                </span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-gray-600">{formatDate(task.dueDate)}</td>
                          </tr>
                        ))
                      )}
                    </>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
