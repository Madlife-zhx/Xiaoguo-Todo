import type { Task, TaskDraft } from './task'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export type TaskField = keyof Pick<TaskDraft, 'title' | 'description' | 'dueDate'>
export type TaskErrors = Partial<Record<TaskField, string>>

export function isRealDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

export function validateTaskDraft(draft: TaskDraft): TaskErrors {
  const errors: TaskErrors = {}
  const title = draft.title.trim()
  const description = draft.description.trim()

  if (!title) errors.title = '请输入任务标题'
  else if (title.length > 100) errors.title = '任务标题不能超过 100 个字符'

  if (description.length > 1000) {
    errors.description = '任务描述不能超过 1000 个字符'
  }

  if (!draft.dueDate) errors.dueDate = '请选择预计完成日期'
  else if (!isRealDate(draft.dueDate)) errors.dueDate = '预计完成日期无效'

  return errors
}

export function isValidTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false
  const task = value as Record<string, unknown>

  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    task.title.trim().length > 0 &&
    task.title.length <= 100 &&
    typeof task.description === 'string' &&
    task.description.length <= 1000 &&
    ['low', 'medium', 'high'].includes(String(task.importance)) &&
    typeof task.dueDate === 'string' &&
    isRealDate(task.dueDate) &&
    ['todo', 'in_progress', 'done'].includes(String(task.status)) &&
    typeof task.createdAt === 'string' &&
    typeof task.updatedAt === 'string'
  )
}
