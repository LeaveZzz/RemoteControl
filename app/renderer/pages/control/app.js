const peer = require('./peer-control')

peer.on('add-stream',play)

function play (stream) {
  let video = document.getElementById('screen-video')
  video.srcObject = stream
  video.onloadedmetadata = () => {
    video.play()
  }
}