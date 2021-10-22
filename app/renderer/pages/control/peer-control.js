const EventsEmitter = require('events')
const peer = new EventsEmitter()
const { desktopCapturer, ipcRenderer } = require('electron')
async function getScreenStream () {
  const sources = await desktopCapturer.getSources({ types: ['screen'] })

  navigator.webkitGetUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: sources[0].id,
        maxWidth: window.screen.width,
        maxHeight: window.screen.height
      }
    }
  }, stream => {
    peer.emit('add-stream', stream)
  }, err => { })
}

getScreenStream()

peer.on('robot', (type, data) => {
  console.log('peer:robot',type, data)
  if (type == 'mouse') {
    data.screen = {
      width: window.screen.width,
      height: window.screen.height
    }
  }
  ipcRenderer.send('robot', type, data)
})

module.exports = peer