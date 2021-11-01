const { BrowserWindow, screen } = require('electron')
const path = require('path')

let win

function create () {
  // let size = screen.getPrimaryDisplay().workAreaSize
  // let width = parseInt(size.width * 0.6)
  // let height = parseInt(size.height * 0.6)
  win = new BrowserWindow({
    height: 1080 * 0.6,
    width: 1920 * 0.6,
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

function send (channel, ...arg) {
  win.webContents.send(channel, ...arg)
}

module.exports = {
  create,
  send
}