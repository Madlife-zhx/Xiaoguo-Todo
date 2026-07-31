import { afterEach, describe, expect, it } from 'vitest'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { loadTasks, saveTasks } from './storage'
import type { Task } from '../shared/task'

const task: Task = {
  id: 'task-1',
  title: '持久化测试',
  description: '关闭后仍保留',
  importance: 'high',
  dueDate: '2026-07-30',
  status: 'todo',
  createdAt: '2026-07-29T00:00:00.000Z',
  updatedAt: '2026-07-29T00:00:00.000Z'
}

const dirs: string[] = []
afterEach(async () => {
  await Promise.all(dirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })))
})

async function dataPath(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'xiaoguo-todo-'))
  dirs.push(dir)
  return join(dir, 'tasks.json')
}

describe('task storage', () => {
  it('saves and reloads tasks', async () => {
    const path = await dataPath()
    expect(await saveTasks(path, [task])).toEqual({ ok: true })
    expect(await loadTasks(path)).toEqual({ tasks: [task] })
    expect(JSON.parse(await readFile(path, 'utf8')).version).toBe(1)
  })

  it('recovers from a backup when the primary file is corrupt', async () => {
    const path = await dataPath()
    await saveTasks(path, [task])
    await writeFile(`${path}.bak`, JSON.stringify({ version: 1, tasks: [task] }))
    await writeFile(path, '{broken')

    const result = await loadTasks(path)
    expect(result.tasks).toEqual([task])
    expect(result.warning).toContain('备份恢复')
  })
})
