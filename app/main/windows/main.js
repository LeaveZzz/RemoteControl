const { BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')

let win

function create () {
  win = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    title: 'LEAVE-MAIN',
  })

  if (isDev) {
    win.loadURL('http://localhost:3000/')
  } else {
    win.loadFile(path.join(__dirname, '../../renderer/pages/main/index.html'))
  }

  win.setTitle('LEAVE-MAIN')
  win.webContents.openDevTools()
}

function send (channel, ...arg) {
  win.webContents.send(channel, ...arg)
}

module.exports = {
  create,
  send
}