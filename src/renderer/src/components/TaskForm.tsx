import type { FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { Task, TaskDraft } from '../../../shared/task'
import { validateTaskDraft, type TaskErrors } from '../../../shared/validation'

interface TaskFormProps {
  task?: Task
  saving: boolean
  onSubmit(draft: TaskDraft): Promise<boolean>
  onCancel(): void
}

const EMPTY_DRAFT: TaskDraft = {
  title: '',
  description: '',
  importance: 'medium',
  dueDate: '',
  status: 'todo'
}

export function TaskForm({ task, saving, onSubmit, onCancel }: TaskFormProps): React.JSX.Element {
  const [draft, setDraft] = useState<TaskDraft>(task ? pickDraft(task) : EMPTY_DRAFT)
  const [errors, setErrors] = useState<TaskErrors>({})
  const titleRef = useRef<HTMLInputElement>(null)
  const dueDateRef = useRef<HTMLInputElement>(null)

  useEffect(() => titleRef.current?.focus(), [])

  const update = <K extends keyof TaskDraft>(key: K, value: TaskDraft[K]): void => {
    setDraft((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  async function handleSubmit(event: FormEvent): Promise<void> {
    event.preventDefault()
    const nextErrors = validateTaskDraft(draft)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.title) titleRef.current?.focus()
      else if (nextErrors.dueDate) dueDateRef.current?.focus()
      return
    }
    await onSubmit(draft)
  }

  return (
    <form className="task-form" onSubmit={(event) => void handleSubmit(event)}>
      <div className="field field--wide">
        <label htmlFor="task-title">任务标题 <span aria-hidden="true">*</span></label>
        <input
          id="task-title"
          ref={titleRef}
          value={draft.title}
          maxLength={100}
          onChange={(event) => update('title', event.target.value)}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'task-title-error' : undefined}
          placeholder="例如：完成项目周报"
        />
        {errors.title && <p className="field__error" id="task-title-error">{errors.title}</p>}
      </div>

      <div className="field field--wide">
        <label htmlFor="task-description">任务描述</label>
        <textarea
          id="task-description"
          rows={4}
          value={draft.description}
          maxLength={1000}
          onChange={(event) => update('description', event.target.value)}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? 'task-description-error' : undefined}
          placeholder="添加任务背景、步骤或备注…"
        />
        <div className="field__meta">
          {errors.description ? (
            <p className="field__error" id="task-description-error">{errors.description}</p>
          ) : <span />}
          <span>{draft.description.length}/1000</span>
        </div>
      </div>

      <div className="field">
        <label htmlFor="task-importance">重要程度</label>
        <select
          id="task-importance"
          value={draft.importance}
          onChange={(event) => update('importance', event.target.value as TaskDraft['importance'])}
        >
          <option value="low">低</option>
          <option value="medium">中</option>
          <option value="high">高</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="task-due-date">预计完成日期 <span aria-hidden="true">*</span></label>
        <input
          id="task-due-date"
          ref={dueDateRef}
          type="date"
          value={draft.dueDate}
          onChange={(event) => update('dueDate', event.target.value)}
          aria-invalid={Boolean(errors.dueDate)}
          aria-describedby={errors.dueDate ? 'task-date-error' : undefined}
        />
        {errors.dueDate && <p className="field__error" id="task-date-error">{errors.dueDate}</p>}
      </div>

      <div className="field field--wide">
        <label htmlFor="task-status">当前状态</label>
        <select
          id="task-status"
          value={draft.status}
          onChange={(event) => update('status', event.target.value as TaskDraft['status'])}
        >
          <option value="todo">待办</option>
          <option value="in_progress">进行中</option>
          <option value="done">已完成</option>
        </select>
      </div>

      <div className="dialog__actions field--wide">
        <button className="button button--ghost" type="button" onClick={onCancel} disabled={saving}>取消</button>
        <button className="button button--primary" type="submit" disabled={saving}>
          {saving ? '正在保存…' : task ? '保存修改' : '创建任务'}
        </button>
      </div>
    </form>
  )
}

function pickDraft(task: Task): TaskDraft {
  return {
    title: task.title,
    description: task.description,
    importance: task.importance,
    dueDate: task.dueDate,
    status: task.status
  }
}
