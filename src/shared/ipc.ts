import type { Task } from './task'

export const IPC_CHANNELS = {
  loadTasks: 'tasks:load',
  saveTasks: 'tasks:save'
} as const

export interface LoadTasksResult {
  tasks: Task[]
  warning?: string
}

export interface SaveTasksResult {
  ok: boolean
  error?: string
}

export interface TodoApi {
  loadTasks(): Promise<LoadTasksResult>
  saveTasks(tasks: Task[]): Promise<SaveTasksResult>
}
