import { describe, expect, it } from 'vitest'
import { getDisplayStatus, isTaskOverdue, todayLocalISO } from './date'
import type { Task } from './task'

const task: Task = {
  id: '1',
  title: '测试任务',
  description: '',
  importance: 'medium',
  dueDate: '2026-07-28',
  status: 'todo',
  createdAt: '2026-07-01T00:00:00.000Z',
  updatedAt: '2026-07-01T00:00:00.000Z'
}

describe('date helpers', () => {
  it('uses local calendar values', () => {
    expect(todayLocalISO(new Date(2026, 6, 9, 23, 30))).toBe('2026-07-09')
  })

  it('marks an unfinished past-due task as overdue', () => {
    expect(isTaskOverdue(task, '2026-07-29')).toBe(true)
    expect(getDisplayStatus(task, '2026-07-29')).toBe('overdue')
  })

  it('does not mark today or completed tasks overdue', () => {
    expect(isTaskOverdue({ ...task, dueDate: '2026-07-29' }, '2026-07-29')).toBe(false)
    expect(isTaskOverdue({ ...task, status: 'done' }, '2026-07-29')).toBe(false)
  })
})
