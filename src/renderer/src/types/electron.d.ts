import type { TodoApi } from '../../../shared/ipc'

declare global {
  interface Window {
    todoApi: TodoApi
  }
}

export {}
