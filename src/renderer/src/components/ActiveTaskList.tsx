import type { Task, TaskStatus } from '../../../shared/task'
import { TaskItem } from './TaskItem'

interface TaskListProps {
  tasks: Task[]
  hasSearch: boolean
  onEdit(task: Task): void
  onDelete(task: Task): void
  onStatusChange(id: string, status: TaskStatus): void
}

export function ActiveTaskList(props: TaskListProps): React.JSX.Element {
  return (
    <section className="list-section" aria-labelledby="active-tasks-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">专注当下</p>
          <h2 id="active-tasks-title">待处理任务</h2>
        </div>
        <span className="section-count">{props.tasks.length} 项</span>
      </div>
      {props.tasks.length ? (
        <div className="task-list">
          {props.tasks.map((task) => <TaskItem key={task.id} task={task} {...props} />)}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state__icon" aria-hidden="true">✓</div>
          <h3>{props.hasSearch ? '没有找到匹配的任务' : '当前没有待处理任务'}</h3>
          <p>{props.hasSearch ? '尝试更换搜索关键词。' : '点击右上角“新建任务”，开始安排今天。'}</p>
        </div>
      )}
    </section>
  )
}
