const { ipcMain } = require('electron')
const { send: sendMainWindow } = require('./windows/main')
const { create: createControlWindow } = require('./windows/control')
const signal = require('./signal')

module.exports = function () {
  ipcMain.handle('login', async () => {
    let { code } = await signal.invoke('login', null, 'logined')
    return code
  })
  ipcMain.on('control', (e, remote) => {
    signal.send('control', { remote })
  })
  signal.on('controled', data => {
    createControlWindow()
    sendMainWindow('control-state-change', data.remote, 1)
  })
  signal.on('be-controled', data => {
    sendMainWindow('control-state-change', data.remote, 2)
  })
  ipcMain.on('forward', (e, event, data) => {
    signal.send('forward', { event, data })
  })
}