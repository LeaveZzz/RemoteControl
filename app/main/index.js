const { app, BrowserWindow } = require('electron')
const path = require('path')
const { create: createMainWindow } = require('./windows/main')
const handleIPC = require('./ipc')

app.on('ready', () => {
  createMainWindow()
  handleIPC()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})