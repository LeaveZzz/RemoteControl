const peer = require('./peer-control')

peer.on('add-stream', play)

let video = document.getElementById('screen-video')

function play (stream) {
  video.srcObject = stream
  video.onloadedmetadata = () => {
    video.play()
  }
}

window.onkeydown = e => {
  console.log('window:onkeydown', e)
  let data = {
    keyCode: e.keyCode,
    shift: e.shiftKey,
    ctrl: e.ctrlKey,
    meta: e.metaKey,
    alt: e.altKey
  }
  peer.emit('robot', 'key', data)
}

window.onmouseup = e => {
  console.log('window:onmouseup', e)
  let data = {
    clientX: e.clientX,
    clientY: e.clientY,
    video: {
      width: video.getBoundingClientRect().width,
      height: video.getBoundingClientRect().height
    }
  }
  peer.emit('robot', 'mouse', data)
}