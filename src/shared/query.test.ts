import { describe, expect, it } from 'vitest'
import { filterAndSortTasks, splitTasks } from './query'
import type { Task } from './task'

const makeTask = (id: string, title: string, dueDate: string, status: Task['status'], description = ''): Task => ({
  id,
  title,
  description,
  dueDate,
  status,
  importance: 'medium',
  createdAt: `2026-07-0${id}T00:00:00.000Z`,
  updatedAt: `2026-07-0${id}T00:00:00.000Z`
})

const tasks = [
  makeTask('1', '写周报', '2026-07-31', 'todo', '整理工作成果'),
  makeTask('2', '预订会议室', '2026-07-27', 'in_progress'),
  makeTask('3', '提交申请', '2026-08-01', 'done')
]

describe('task query', () => {
  it('searches title and description', () => {
    expect(filterAndSortTasks(tasks, '成果', 'due_asc').map((task) => task.id)).toEqual(['1'])
  })

  it('sorts dates in both directions', () => {
    expect(filterAndSortTasks(tasks, '', 'due_asc').map((task) => task.id)).toEqual(['2', '1', '3'])
    expect(filterAndSortTasks(tasks, '', 'due_desc').map((task) => task.id)).toEqual(['3', '1', '2'])
  })

  it('orders overdue first and keeps completed separate', () => {
    const sorted = filterAndSortTasks(tasks, '', 'status', '2026-07-29')
    expect(sorted.map((task) => task.id)).toEqual(['2', '1', '3'])
    expect(splitTasks(sorted)).toEqual({ active: [tasks[1], tasks[0]], completed: [tasks[2]] })
  })
})
