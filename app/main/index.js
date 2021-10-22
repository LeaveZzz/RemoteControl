const { app, BrowserWindow } = require('electron')
const path = require('path')
// const { create: createMainWindow } = require('./windows/main')
const { create: createControlWindow } = require('./windows/control')

const handleIPC = require('./ipc')

app.on('ready', () => {
  createControlWindow()
  handleIPC()
  require('./robot.js')()
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