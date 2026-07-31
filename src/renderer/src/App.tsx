import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { isTaskOverdue } from '../../shared/date'
import { filterAndSortTasks, splitTasks } from '../../shared/query'
import type { SortMode, Task, TaskDraft, TaskStatus } from '../../shared/task'
import { ActiveTaskList } from './components/ActiveTaskList'
import { CompletedTaskList } from './components/CompletedTaskList'
import { StatsBar } from './components/StatsBar'
import { TaskDialog } from './components/TaskDialog'
import { Toolbar } from './components/Toolbar'
import { useTasks } from './state/TasksContext'

export default function App(): React.JSX.Element {
  const { tasks, loading, saving, message, error, addTask, updateTask, changeStatus, deleteTask, clearNotice } = useTasks()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task>()
  const [deletingTask, setDeletingTask] = useState<Task>()
  const [search, setSearch] = useState('')
  const [sortMode, setSortMode] = useState<SortMode>('due_asc')
  const searchRef = useRef<HTMLInputElement>(null)

  const openCreate = useCallback(() => {
    setEditingTask(undefined)
    setDialogOpen(true)
  }, [])

  const closeDialog = useCallback(() => {
    if (!saving) setDialogOpen(false)
  }, [saving])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'n') {
        event.preventDefault()
        openCreate()
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'f') {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [openCreate])

  useEffect(() => {
    if (!message && !error) return
    const timer = window.setTimeout(clearNotice, error ? 7000 : 3500)
    return () => window.clearTimeout(timer)
  }, [clearNotice, error, message])

  const visible = useMemo(
    () => splitTasks(filterAndSortTasks(tasks, search, sortMode)),
    [search, sortMode, tasks]
  )

  const overdueCount = useMemo(() => tasks.filter((task) => isTaskOverdue(task)).length, [tasks])
  const completedCount = tasks.filter((task) => task.status === 'done').length

  async function submitTask(draft: TaskDraft): Promise<boolean> {
    const ok = editingTask ? await updateTask(editingTask.id, draft) : await addTask(draft)
    if (ok) setDialogOpen(false)
    return ok
  }

  const handleEdit = (task: Task): void => {
    setEditingTask(task)
    setDialogOpen(true)
  }

  const handleStatusChange = (id: string, status: TaskStatus): void => {
    void changeStatus(id, status)
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <div className="brand__mark" aria-hidden="true">🐱</div>
          <div>
            <p className="brand__name">晓果代办</p>
            <p className="brand__tagline">开始你的工作规划</p>
          </div>
        </div>
        <button className="button button--primary button--new" type="button" onClick={openCreate}>
          <span aria-hidden="true">＋</span> 新建任务 <kbd>Ctrl N</kbd>
        </button>
      </header>

      <main>
        <section className="hero">
          <div>
            <p className="eyebrow">今天也要保持好节奏</p>
            <h1>开始你的工作规划</h1>
            <p>清晰安排每一项任务，重要的事情从容完成。</p>
          </div>
          <div className="hero__decoration" aria-hidden="true"><span>🐱</span></div>
        </section>

        <StatsBar
          total={tasks.length}
          active={tasks.length - completedCount}
          overdue={overdueCount}
          completed={completedCount}
        />

        <Toolbar
          search={search}
          sortMode={sortMode}
          searchRef={searchRef}
          onSearchChange={setSearch}
          onSortChange={setSortMode}
        />

        {loading ? (
          <div className="loading-state"><span className="spinner" />正在读取任务数据…</div>
        ) : (
          <div className="lists">
            <ActiveTaskList
              tasks={visible.active}
              hasSearch={Boolean(search.trim())}
              onEdit={handleEdit}
              onDelete={setDeletingTask}
              onStatusChange={handleStatusChange}
            />
            <CompletedTaskList
              tasks={visible.completed}
              onEdit={handleEdit}
              onDelete={setDeletingTask}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}
      </main>

      {(message || error) && (
        <div className={`toast ${error ? 'toast--error' : 'toast--success'}`} role="status">
          <span aria-hidden="true">{error ? '!' : '✓'}</span>
          {error || message}
          <button type="button" onClick={clearNotice} aria-label="关闭提示">×</button>
        </div>
      )}

      {dialogOpen && (
        <TaskDialog
          key={editingTask?.id ?? 'new'}
          task={editingTask}
          saving={saving}
          onSubmit={submitTask}
          onClose={closeDialog}
        />
      )}

      {deletingTask && (
        <div className="dialog-backdrop">
          <div className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description">
            <div className="confirm-dialog__icon" aria-hidden="true">!</div>
            <h2 id="delete-title">确认删除任务？</h2>
            <p id="delete-description">“{deletingTask.title}”删除后无法恢复。</p>
            <div className="dialog__actions">
              <button className="button button--ghost" type="button" disabled={saving} onClick={() => setDeletingTask(undefined)}>取消</button>
              <button
                className="button button--danger"
                type="button"
                disabled={saving}
                onClick={() => {
                  void deleteTask(deletingTask.id).then((ok) => {
                    if (ok) setDeletingTask(undefined)
                  })
                }}
              >
                {saving ? '正在删除…' : '确认删除'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
