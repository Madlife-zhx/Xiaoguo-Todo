import { formatDueDate, getDisplayStatus, dueDateHint } from '../../../shared/date'
import { IMPORTANCE_LABELS, STATUS_LABELS, type Task, type TaskStatus } from '../../../shared/task'

interface TaskItemProps {
  task: Task
  onEdit(task: Task): void
  onDelete(task: Task): void
  onStatusChange(id: string, status: TaskStatus): void
}

export function TaskItem({ task, onEdit, onDelete, onStatusChange }: TaskItemProps): React.JSX.Element {
  const displayStatus = getDisplayStatus(task)
  const isCompleted = task.status === 'done'

  return (
    <article className={`task-card ${isCompleted ? 'task-card--completed' : ''} ${displayStatus === 'overdue' ? 'task-card--overdue' : ''}`}>
      <div className="task-card__top">
        <div className="task-card__heading">
          <span className={`status-dot status-dot--${displayStatus}`} aria-hidden="true" />
          <div>
            <h3>{task.title}</h3>
            <div className="badges">
              <span className={`badge badge--${displayStatus}`}>{STATUS_LABELS[displayStatus]}</span>
              <span className={`badge badge--importance-${task.importance}`}>重要程度：{IMPORTANCE_LABELS[task.importance]}</span>
            </div>
          </div>
        </div>
        <div className="task-card__actions">
          <button className="text-button" type="button" onClick={() => onEdit(task)}>编辑</button>
          <button className="text-button text-button--danger" type="button" onClick={() => onDelete(task)}>删除</button>
        </div>
      </div>

      {task.description ? (
        <p className="task-card__description">{task.description}</p>
      ) : (
        <p className="task-card__description task-card__description--empty">暂无任务描述</p>
      )}

      <div className="task-card__footer">
        <div className="due-date">
          <span className="due-date__icon" aria-hidden="true">□</span>
          <span>{formatDueDate(task.dueDate)}</span>
          <span className={displayStatus === 'overdue' ? 'due-date__hint due-date__hint--danger' : 'due-date__hint'}>
            {isCompleted ? '已按计划归档' : dueDateHint(task.dueDate)}
          </span>
        </div>

        <label className="quick-status">
          <span>状态</span>
          <select
            value={task.status}
            onChange={(event) => onStatusChange(task.id, event.target.value as TaskStatus)}
            aria-label={`修改“${task.title}”的状态`}
          >
            <option value="todo">待办</option>
            <option value="in_progress">进行中</option>
            <option value="done">已完成</option>
          </select>
        </label>
      </div>
    </article>
  )
}
