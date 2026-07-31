import { getDisplayStatus } from './date'
import type { SortMode, Task } from './task'

const STATUS_ORDER = {
  overdue: 0,
  in_progress: 1,
  todo: 2,
  done: 3
} as const

function compareCreatedAt(a: Task, b: Task): number {
  return b.createdAt.localeCompare(a.createdAt)
}

export function filterAndSortTasks(
  tasks: Task[],
  search: string,
  sortMode: SortMode,
  today?: string
): Task[] {
  const term = search.trim().toLocaleLowerCase('zh-CN')
  const filtered = term
    ? tasks.filter((task) =>
        `${task.title}\n${task.description}`.toLocaleLowerCase('zh-CN').includes(term)
      )
    : [...tasks]

  return filtered.sort((a, b) => {
    let result = 0
    if (sortMode === 'due_asc') result = a.dueDate.localeCompare(b.dueDate)
    if (sortMode === 'due_desc') result = b.dueDate.localeCompare(a.dueDate)
    if (sortMode === 'status') {
      result = STATUS_ORDER[getDisplayStatus(a, today)] - STATUS_ORDER[getDisplayStatus(b, today)]
    }
    return result || compareCreatedAt(a, b)
  })
}

export function splitTasks(tasks: Task[]): { active: Task[]; completed: Task[] } {
  return {
    active: tasks.filter((task) => task.status !== 'done'),
    completed: tasks.filter((task) => task.status === 'done')
  }
}
