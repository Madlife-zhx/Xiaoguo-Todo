import type { Task } from '../../../shared/task'

export type TasksAction =
  | { type: 'replace'; tasks: Task[] }
  | { type: 'add'; task: Task }
  | { type: 'update'; task: Task }
  | { type: 'remove'; id: string }

export function tasksReducer(tasks: Task[], action: TasksAction): Task[] {
  switch (action.type) {
    case 'replace':
      return action.tasks
    case 'add':
      return [action.task, ...tasks]
    case 'update':
      return tasks.map((task) => (task.id === action.task.id ? action.task : task))
    case 'remove':
      return tasks.filter((task) => task.id !== action.id)
  }
}
