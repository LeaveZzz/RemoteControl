const EventsEmitter = require('events')
const peer = new EventsEmitter()
const { desktopCapturer } = require('electron')
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

module.exports = peer