import { app, BrowserWindow, shell } from 'electron'
import { join } from 'node:path'
import { registerTaskIpc } from './ipc'

let mainWindow: BrowserWindow | null = null

const singleInstance = app.requestSingleInstanceLock()
if (!singleInstance) app.quit()

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 760,
    minWidth: 760,
    minHeight: 600,
    show: false,
    title: '晓果代办',
    backgroundColor: '#f4f9fc',
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })

  mainWindow.once('ready-to-show', () => mainWindow?.show())

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) void shell.openExternal(url)
    return { action: 'deny' }
  })

  mainWindow.webContents.on('will-navigate', (event, url) => {
    const currentUrl = mainWindow?.webContents.getURL()
    if (currentUrl && url !== currentUrl) event.preventDefault()
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    void mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    void mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

if (singleInstance) {
  app.whenReady().then(() => {
    app.setAppUserModelId('com.xiaoguo.todo')
    registerTaskIpc(app.getPath('userData'))
    createWindow()
  })

  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.show()
      mainWindow.focus()
    }
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  app.on('window-all-closed', () => app.quit())
}
