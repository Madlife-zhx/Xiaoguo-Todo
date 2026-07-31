import { describe, expect, it } from 'vitest'
import type { Task } from '../../../shared/task'
import { tasksReducer } from './tasksReducer'

const task: Task = {
  id: '1',
  title: '任务',
  description: '',
  importance: 'low',
  dueDate: '2026-07-30',
  status: 'todo',
  createdAt: '2026-07-29T00:00:00.000Z',
  updatedAt: '2026-07-29T00:00:00.000Z'
}

describe('tasksReducer', () => {
  it('adds, updates and removes tasks immutably', () => {
    const added = tasksReducer([], { type: 'add', task })
    expect(added).toEqual([task])

    const updatedTask = { ...task, title: '更新后的任务' }
    const updated = tasksReducer(added, { type: 'update', task: updatedTask })
    expect(updated[0].title).toBe('更新后的任务')
    expect(added[0].title).toBe('任务')

    expect(tasksReducer(updated, { type: 'remove', id: '1' })).toEqual([])
  })
})
