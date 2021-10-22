const { ipcMain } = require('electron')
const robot = require('robotjs')
const vkey = require('vkey')

/**
 * 鼠标点击事件触发
 * @param {Object} data {clientX,clientY,screen:{width,height},video:{width,height}} 
 */
function handleMouse (data) {
  let { clientX, clientY, screen, video } = data
  let x = clientX * screen.width / video.width
  let y = clientY * screen.height / video.height
  robot.moveMouse(x, y)
    robot.mouseClick()
}

/**
 * 键盘按键触发
 * @param {Object} data {keyCode,meta,alt,ctrl,shift} 
 */
function handleKey (data) {
  let modifiers = []
  if (data.meta) modifiers.push('command')
  if (data.alt) modifiers.push('alt')
  if (data.ctrl) modifiers.push('control')
  if (data.shift) modifiers.push('shift')
  let key = vkey[data.keyCode].toLowerCase()
  console.log(key)
  if (key[0] !== '<') { //<shift>
    robot.keyTap(key, modifiers)
  }
}

module.exports = function () {
  ipcMain.on('robot', (e, type, data) => {
    if (type === 'mouse') {
      handleMouse(data)
    } else {
      handleKey(data)
    }
  })
}