import { useEffect, useRef } from 'react'
import type { Task, TaskDraft } from '../../../shared/task'
import { TaskForm } from './TaskForm'

interface TaskDialogProps {
  task?: Task
  saving: boolean
  onSubmit(draft: TaskDraft): Promise<boolean>
  onClose(): void
}

export function TaskDialog({ task, saving, onSubmit, onClose }: TaskDialogProps): React.JSX.Element {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && !saving) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, saving])

  return (
    <div
      className="dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose()
      }}
    >
      <div
        className="dialog"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-dialog-title"
      >
        <div className="dialog__header">
          <div>
            <p className="eyebrow">{task ? '编辑任务' : '添加任务'}</p>
            <h2 id="task-dialog-title">{task ? '更新任务详情' : '创建一个新任务'}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} disabled={saving} aria-label="关闭">
            ×
          </button>
        </div>
        <TaskForm
          task={task}
          saving={saving}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  )
}
