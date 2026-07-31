import type { DisplayStatus, Task } from './task'

export function todayLocalISO(now = new Date()): string {
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function isTaskOverdue(task: Task, today = todayLocalISO()): boolean {
  return task.status !== 'done' && task.dueDate < today
}

export function getDisplayStatus(task: Task, today = todayLocalISO()): DisplayStatus {
  return isTaskOverdue(task, today) ? 'overdue' : task.status
}

export function formatDueDate(value: string): string {
  const [year, month, day] = value.split('-')
  return `${year}年${Number(month)}月${Number(day)}日`
}

export function dueDateHint(value: string, today = todayLocalISO()): string {
  const toUtcDay = (date: string): number => {
    const [year, month, day] = date.split('-').map(Number)
    return Date.UTC(year, month - 1, day)
  }
  const days = Math.round((toUtcDay(value) - toUtcDay(today)) / 86_400_000)

  if (days === 0) return '今天到期'
  if (days === 1) return '明天到期'
  if (days === -1) return '已逾期 1 天'
  if (days < 0) return `已逾期 ${Math.abs(days)} 天`
  return `还有 ${days} 天`
}
