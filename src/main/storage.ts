import { copyFile, mkdir, open, readFile, rename, unlink } from 'node:fs/promises'
import { dirname } from 'node:path'
import type { LoadTasksResult, SaveTasksResult } from '../shared/ipc'
import type { Task, TaskDataFile } from '../shared/task'
import { isValidTask } from '../shared/validation'

const DATA_VERSION = 1

function parseData(raw: string): Task[] | null {
  try {
    const parsed = JSON.parse(raw) as Partial<TaskDataFile>
    if (parsed.version !== DATA_VERSION || !Array.isArray(parsed.tasks)) return null
    return parsed.tasks.filter(isValidTask)
  } catch {
    return null
  }
}

async function readTasksFile(path: string): Promise<Task[] | null> {
  try {
    return parseData(await readFile(path, 'utf8'))
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code
    if (code === 'ENOENT') return null
    throw error
  }
}

export async function loadTasks(dataPath: string): Promise<LoadTasksResult> {
  const backupPath = `${dataPath}.bak`

  try {
    const tasks = await readTasksFile(dataPath)
    if (tasks) return { tasks }

    const backup = await readTasksFile(backupPath)
    if (backup) {
      const restored = await writeDataFile(dataPath, backup)
      return {
        tasks: backup,
        warning: restored.ok
          ? '检测到数据文件异常，已从最近一次备份恢复。'
          : '检测到数据文件异常，已读取备份，但无法修复正式数据文件。'
      }
    }

    return { tasks: [], warning: undefined }
  } catch (error) {
    return {
      tasks: [],
      warning: `无法读取任务数据：${error instanceof Error ? error.message : '未知错误'}`
    }
  }
}

async function writeDataFile(dataPath: string, tasks: Task[]): Promise<SaveTasksResult> {
  const tempPath = `${dataPath}.tmp`
  const directory = dirname(dataPath)
  const data: TaskDataFile = { version: DATA_VERSION, tasks }

  try {
    await mkdir(directory, { recursive: true })
    const handle = await open(tempPath, 'w')
    try {
      await handle.writeFile(`${JSON.stringify(data, null, 2)}\n`, 'utf8')
      await handle.sync()
    } finally {
      await handle.close()
    }

    await rename(tempPath, dataPath)
    try {
      const directoryHandle = await open(directory, 'r')
      try {
        await directoryHandle.sync()
      } finally {
        await directoryHandle.close()
      }
    } catch {
      // Windows 某些文件系统不允许同步目录，任务文件本身已经完成同步。
    }
    return { ok: true }
  } catch (error) {
    try {
      await unlink(tempPath)
    } catch {
      // 临时文件可能尚未创建。
    }
    return {
      ok: false,
      error: `保存任务失败：${error instanceof Error ? error.message : '未知错误'}`
    }
  }
}

export async function saveTasks(dataPath: string, tasks: Task[]): Promise<SaveTasksResult> {
  if (!tasks.every(isValidTask)) {
    return { ok: false, error: '任务数据校验失败，未执行保存。' }
  }

  const backupPath = `${dataPath}.bak`
  const olderBackupPath = `${dataPath}.bak1`

  try {
    await mkdir(dirname(dataPath), { recursive: true })
    try {
      await copyFile(backupPath, olderBackupPath)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
    }

    try {
      await copyFile(dataPath, backupPath)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
    }

    return await writeDataFile(dataPath, tasks)
  } catch (error) {
    return {
      ok: false,
      error: `保存任务失败：${error instanceof Error ? error.message : '未知错误'}`
    }
  }
}
