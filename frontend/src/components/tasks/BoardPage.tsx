import { useMemo, useState } from 'react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import type { TaskPriority, TaskResponse, TaskStatus } from '../../types/task'
import { BOARD_COLUMNS } from '../../types/task'
import { useTasks } from '../../hooks/useTasks'
import { useUpdateTask } from '../../hooks/useUpdateTask'
import { BoardColumn } from './BoardColumn'
import { PriorityFilter } from './PriorityFilter'
import { CreateTaskModal } from './CreateTaskModal'
import { TaskCard } from './TaskCard'
import { sortTasks, SORT_OPTIONS } from '../../lib/sortTasks'
import type { SortKey } from '../../lib/sortTasks'

export function BoardPage() {
  const [priority, setPriority] = useState<TaskPriority | undefined>()
  const [sortKey, setSortKey] = useState<SortKey>('priority')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [draggingTask, setDraggingTask] = useState<TaskResponse | null>(null)
  const { data: tasks = [], isLoading, isError } = useTasks(priority)
  const { mutate: updateTask } = useUpdateTask()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const columns = useMemo(
    () => ({
      todo: sortTasks(tasks.filter((t) => t.status === 'todo'), sortKey),
      in_progress: sortTasks(tasks.filter((t) => t.status === 'in_progress'), sortKey),
      done: sortTasks(tasks.filter((t) => t.status === 'done'), sortKey),
    }),
    [tasks, sortKey],
  )

  function handleDragStart(event: DragStartEvent) {
    const task = event.active.data.current?.task as TaskResponse
    setDraggingTask(task ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    setDraggingTask(null)
    const { active, over } = event
    if (!over) return

    const task = active.data.current?.task as TaskResponse
    const newStatus = over.id as TaskStatus
    if (task.status === newStatus) return

    updateTask({ id: task.id, request: { status: newStatus } })
  }

  return (
    <main className="flex h-[calc(100vh-56px)] flex-col overflow-hidden">
      <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <h1 className="text-lg font-bold text-gray-800">タスク一覧</h1>
        <div className="flex items-center gap-3">
          <select
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
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
            <DragOverlay>
              {draggingTask && (
                <div className="rotate-2 opacity-90 shadow-2xl">
                  <TaskCard task={draggingTask} />
                </div>
              )}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </main>
  )
}
