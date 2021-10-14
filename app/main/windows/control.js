const { BrowserWindow } = require('electron')
const path = require('path')

let win

function create () {
  win = new BrowserWindow({
    height: 768,
    width: 1024,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    title: 'LEAVE-CONTROL'
  })

  win.loadFile(path.join(__dirname, '../../renderer/pages/control/index.html'))

  win.setTitle('LEAVE-CONTROL')
  win.webContents.openDevTools()
}

module.exports = {
  create
}