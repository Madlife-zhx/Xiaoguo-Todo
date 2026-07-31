import { ipcMain } from 'electron'
import { join } from 'node:path'
import { IPC_CHANNELS } from '../shared/ipc'
import type { Task } from '../shared/task'
import { loadTasks, saveTasks } from './storage'

export function registerTaskIpc(userDataPath: string): void {
  const dataPath = join(userDataPath, 'tasks.json')

  ipcMain.handle(IPC_CHANNELS.loadTasks, () => loadTasks(dataPath))
  ipcMain.handle(IPC_CHANNELS.saveTasks, (_event, tasks: Task[]) => saveTasks(dataPath, tasks))
}
