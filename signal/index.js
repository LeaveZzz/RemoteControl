const { WebSocketServer } = require('ws')
const wss = new WebSocketServer({ port: 8010 }, () => {
  console.log('8010端口监听成功')
})

const code2ws = new Map()

wss.on('connection', (ws, request) => {
  //ws => 端
  let code = Math.floor(Math.random() * (999999 - 100000)) + 100000
  code2ws.set(code, ws)
  ws.sendData = (event, data) => {
    ws.send(JSON.stringify({ event, data }))
  }
  ws.sendError = msg => {
    ws.sendData('error', { msg })
  }
  console.log(`${code}已连接`)
  ws.on('message', message => {
    // {event,data}
    let parseMessage = {}
    try {
      parseMessage = JSON.parse(message)
    } catch (error) {
      ws.sendError('message invalid')
      console.log('parse message error', error)
      return
    }
    let { event, data } = parseMessage
    console.log(parseMessage)
    if (event == 'login') {
      ws.sendData('logined', { code })
    } else if (event === 'control') {
      let remote = + data.remote
      if (code2ws.has(remote)) {
        ws.sendData('controled', { remote })
        ws.sendRemote = code2ws.get(remote).sendData
        code2ws.get(remote).sendRemote = ws.sendData
        ws.sendRemote('be-controled', { remote: code })
        console.log('current-code:', { code, ws }, 'remote-code:', { remote, ws: code2ws.get(remote) })
      }
    } else if (event === 'forward') {
      // data = {event, data}
      ws.sendRemote(data.event, data.data)
    }
  })

  ws.on('close', () => {
    code2ws.delete(code)
    clearTimeout(ws._clearTimeout)
  })

  ws._clearTimeout = setTimeout(() => {
    ws.terminate()
  }, 10 * 60 * 1000)
})