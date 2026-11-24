import { useMemo, useState } from 'react'
import type { TaskPriority } from '../../types/task'
import { BOARD_COLUMNS } from '../../types/task'
import { useTasks } from '../../hooks/useTasks'
import { BoardColumn } from './BoardColumn'
import { PriorityFilter } from './PriorityFilter'

export function BoardPage() {
  const [priority, setPriority] = useState<TaskPriority | undefined>()
  const { data: tasks = [], isLoading, isError } = useTasks(priority)

  const columns = useMemo(
    () => ({
      todo: tasks.filter((t) => t.status === 'todo'),
      in_progress: tasks.filter((t) => t.status === 'in_progress'),
      done: tasks.filter((t) => t.status === 'done'),
    }),
    [tasks],
  )

  return (
    <main className="flex h-[calc(100vh-56px)] flex-col overflow-hidden">
      <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <h1 className="text-lg font-bold text-gray-800">タスク一覧</h1>
        <PriorityFilter value={priority} onChange={setPriority} />
      </div>

      <div className="flex-1 overflow-auto px-6 py-4">
        {isLoading && (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}

        {isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            タスクの取得に失敗しました。バックエンドが起動しているか確認してください。
          </div>
        )}

        {!isLoading && !isError && (
          <div className="flex gap-4">
            {BOARD_COLUMNS.map((col) => (
              <BoardColumn
                key={col.status}
                title={col.label}
                status={col.status}
                tasks={columns[col.status]}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
