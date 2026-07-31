import { describe, expect, it } from 'vitest'
import { validateTaskDraft } from './validation'
import type { TaskDraft } from './task'

const valid: TaskDraft = {
  title: '完成周报',
  description: '整理本周进度',
  importance: 'high',
  dueDate: '2026-07-30',
  status: 'in_progress'
}

describe('validateTaskDraft', () => {
  it('accepts a valid draft', () => {
    expect(validateTaskDraft(valid)).toEqual({})
  })

  it('requires title and due date', () => {
    expect(validateTaskDraft({ ...valid, title: ' ', dueDate: '' })).toEqual({
      title: '请输入任务标题',
      dueDate: '请选择预计完成日期'
    })
  })

  it('rejects impossible calendar dates', () => {
    expect(validateTaskDraft({ ...valid, dueDate: '2026-02-30' }).dueDate).toBe('预计完成日期无效')
  })
})
