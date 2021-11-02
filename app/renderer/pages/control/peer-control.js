const { ipcRenderer } = window.require('electron')
const EventsEmitter = require('events')
const peer = new EventsEmitter()
// const { ipcRenderer } = require('electron')

// peer.on('robot', (type, data) => {
//   console.log('peer:robot',type, data)
//   if (type == 'mouse') {
//     data.screen = {
//       width: window.screen.width,
//       height: window.screen.height
//     }
//   }
//   ipcRenderer.send('robot', type, data)
// })

const pc = new window.RTCPeerConnection({})

pc.onicecandidate = e => {
  console.log('candidate', JSON.stringify(e.candidate))
  if (e.candidate) {
    ipcRenderer.send('forward', 'control-candidate', JSON.stringify(e.candidate))
  }
}

ipcRenderer.on('puppet-candidate', (e, candidate) => {
  addIceCandidate(candidate)
})

let candidates = []
async function addIceCandidate (candidate) {
  if (candidate) {
    candidates.push(JSON.parse(candidate))
  }
  if (pc.remoteDescription && pc.remoteDescription.type) {
    for (let i = 0; i < candidates.length; i++) {
      await pc.addIceCandidate(new RTCIceCandidate(candidates[i]))
    }
    candidates = []
  }
}

async function createOffer () {
  const offer = await pc.createOffer({
    offerToReceiveAudio: false,
    offerToReceiveVideo: true
  })
  await pc.setLocalDescription(offer)
  console.log('pc_offer', JSON.stringify(offer))
  return pc.localDescription
}
createOffer().then(offer => {
  ipcRenderer.send('forward', 'offer', { type: offer.type, sdp: offer.sdp })
})

async function setRemote (offer) {
  await pc.setRemoteDescription(offer)
}

ipcRenderer.on('answer', (e, answer) => {
  setRemote(answer)
})

pc.onaddstream = e => {
  console.log('add_stream', e.stream)
  peer.emit('add-stream', e.stream)
}

module.exports = peer
