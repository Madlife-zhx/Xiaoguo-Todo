import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS, type TodoApi } from '../shared/ipc'
import type { Task } from '../shared/task'

const api: TodoApi = {
  loadTasks: () => ipcRenderer.invoke(IPC_CHANNELS.loadTasks),
  saveTasks: (tasks: Task[]) => ipcRenderer.invoke(IPC_CHANNELS.saveTasks, tasks)
}

contextBridge.exposeInMainWorld('todoApi', api)
