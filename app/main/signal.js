const WebSocket = require('ws')
const EventEmitter = require('events')
const signal = new EventEmitter()

const ws = new WebSocket('ws://101.132.244.8:8010')
// const ws = new WebSocket('ws://127.0.0.1:8010')


ws.on('open', () => {
  // ws.send('connect success')
})

ws.on('message', message => {
  let data = {}
  try {
    data = JSON.parse(message)
  } catch (error) {
    console.log('parse error', error)
  }
  signal.emit(data.event, data.data)
})

function send (event, data) {
  ws.send(JSON.stringify({event, data}))
}

function invoke (event, data, answerEvent) {
  return new Promise((resolve, reject) => {
    send(event, data)
    signal.once(answerEvent, resolve)
    setTimeout(() => {
      reject('timeout')
    }, 5 * 1000)
  })
}

signal.send = send
signal.invoke = invoke

module.exports = signal