import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState
} from 'react'
import type { Task, TaskDraft, TaskStatus } from '../../../shared/task'
import { tasksReducer } from './tasksReducer'

interface TasksContextValue {
  tasks: Task[]
  loading: boolean
  saving: boolean
  message: string
  error: string
  addTask(draft: TaskDraft): Promise<boolean>
  updateTask(id: string, draft: TaskDraft): Promise<boolean>
  changeStatus(id: string, status: TaskStatus): Promise<boolean>
  deleteTask(id: string): Promise<boolean>
  clearNotice(): void
}

const TasksContext = createContext<TasksContextValue | null>(null)

export function TasksProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [tasks, dispatch] = useReducer(tasksReducer, [])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const tasksRef = useRef<Task[]>([])
  const saveQueue = useRef<Promise<unknown>>(Promise.resolve())

  useEffect(() => {
    let cancelled = false
    window.todoApi
      .loadTasks()
      .then((result) => {
        if (cancelled) return
        dispatch({ type: 'replace', tasks: result.tasks })
        tasksRef.current = result.tasks
        if (result.warning) setError(result.warning)
      })
      .catch(() => {
        if (!cancelled) setError('无法加载任务数据，请重新启动应用。')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const persist = useCallback((buildTasks: (current: Task[]) => Task[], successMessage: string): Promise<boolean> => {
    const operation = saveQueue.current
      .catch(() => undefined)
      .then(async () => {
        setSaving(true)
        setError('')
        const previousTasks = tasksRef.current
        const nextTasks = buildTasks(previousTasks)
        try {
          const result = await window.todoApi.saveTasks(nextTasks)
          if (!result.ok) {
            setError(result.error ?? '数据保存失败，请稍后重试。')
            return false
          }
          dispatch({ type: 'replace', tasks: nextTasks })
          tasksRef.current = nextTasks
          setMessage(successMessage)
          return true
        } catch {
          setError('数据保存失败，请检查程序的数据目录权限。')
          return false
        } finally {
          setSaving(false)
        }
      })

    saveQueue.current = operation
    return operation
  }, [])

  const addTask = useCallback(
    (draft: TaskDraft) => {
      const now = new Date().toISOString()
      const task: Task = {
        ...draft,
        title: draft.title.trim(),
        description: draft.description.trim(),
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now
      }
      return persist((current) => [task, ...current], '任务已创建')
    },
    [persist]
  )

  const updateTask = useCallback(
    (id: string, draft: TaskDraft) => {
      return persist(
        (current) => current.map((task) =>
          task.id === id
            ? {
                ...task,
                ...draft,
                title: draft.title.trim(),
                description: draft.description.trim(),
                updatedAt: new Date().toISOString()
              }
            : task
        ),
        '任务已更新'
      )
    },
    [persist]
  )

  const changeStatus = useCallback(
    (id: string, status: TaskStatus) => {
      const notice = status === 'done' ? '任务已移入已完成列表' : '任务状态已更新'
      return persist(
        (current) => current.map((task) =>
          task.id === id ? { ...task, status, updatedAt: new Date().toISOString() } : task
        ),
        notice
      )
    },
    [persist]
  )

  const deleteTask = useCallback(
    (id: string) => persist((current) => current.filter((task) => task.id !== id), '任务已删除'),
    [persist]
  )

  const value = useMemo<TasksContextValue>(
    () => ({
      tasks,
      loading,
      saving,
      message,
      error,
      addTask,
      updateTask,
      changeStatus,
      deleteTask,
      clearNotice: () => {
        setMessage('')
        setError('')
      }
    }),
    [addTask, changeStatus, deleteTask, error, loading, message, saving, tasks, updateTask]
  )

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
}

export function useTasks(): TasksContextValue {
  const context = useContext(TasksContext)
  if (!context) throw new Error('useTasks 必须在 TasksProvider 中使用')
  return context
}
