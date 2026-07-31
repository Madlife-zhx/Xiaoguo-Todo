export type Importance = 'low' | 'medium' | 'high'
export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type DisplayStatus = TaskStatus | 'overdue'
export type SortMode = 'due_asc' | 'due_desc' | 'status'

export interface Task {
  id: string
  title: string
  description: string
  importance: Importance
  dueDate: string
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

export interface TaskDraft {
  title: string
  description: string
  importance: Importance
  dueDate: string
  status: TaskStatus
}

export interface TaskDataFile {
  version: 1
  tasks: Task[]
}

export const IMPORTANCE_LABELS: Record<Importance, string> = {
  low: '低',
  medium: '中',
  high: '高'
}

export const STATUS_LABELS: Record<DisplayStatus, string> = {
  todo: '待办',
  in_progress: '进行中',
  done: '已完成',
  overdue: '已逾期'
}
