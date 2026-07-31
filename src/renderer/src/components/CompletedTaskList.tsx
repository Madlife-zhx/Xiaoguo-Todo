import { useState } from 'react'
import type { Task, TaskStatus } from '../../../shared/task'
import { TaskItem } from './TaskItem'

interface CompletedTaskListProps {
  tasks: Task[]
  onEdit(task: Task): void
  onDelete(task: Task): void
  onStatusChange(id: string, status: TaskStatus): void
}

export function CompletedTaskList(props: CompletedTaskListProps): React.JSX.Element {
  const [expanded, setExpanded] = useState(true)

  return (
    <section className="list-section list-section--completed" aria-labelledby="completed-tasks-title">
      <button className="section-heading section-heading--button" type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>
        <div>
          <p className="eyebrow eyebrow--green">轻松回顾</p>
          <h2 id="completed-tasks-title">已完成</h2>
        </div>
        <span className="section-heading__right">
          <span className="section-count section-count--green">{props.tasks.length} 项</span>
          <span className={`chevron ${expanded ? 'chevron--expanded' : ''}`} aria-hidden="true">⌄</span>
        </span>
      </button>
      {expanded && (
        props.tasks.length ? (
          <div className="task-list">
            {props.tasks.map((task) => <TaskItem key={task.id} task={task} {...props} />)}
          </div>
        ) : (
          <div className="completed-empty">完成的任务会保存在这里，随时可以恢复或查看。</div>
        )
      )}
    </section>
  )
}
