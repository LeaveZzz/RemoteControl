import React, { useState, useEffect } from 'react'
import './App.css'
import './peer-puppet'
const { ipcRenderer } = window.require('electron')

function App () {
  const [remoteCode, setRemoteCode] = useState('')
  const [localCode, setLocalCode] = useState('')
  const [controlText, setControlText] = useState('')

  const login = async () => {
    let code = await ipcRenderer.invoke('login')
    setLocalCode(code)
  }

  useEffect(() => {
    login()
    ipcRenderer.on('control-state-change', handleControlState)
    return () => {
      ipcRenderer.removeListener('control-state-change', handleControlState)
    }
  }, [])
  const startControl = () => {
    ipcRenderer.send('control', remoteCode)
  }
  const handleControlState = (channel, name, type) => {
    let text = ''
    if (type === 1) {
      //控制别人
      text = `正在远程控制${name}`
    } else if (type === 2) {
      //被控制
      text = `被${name}控制中`
    }
    setControlText(text)
  }
  return (
    <div className="App">
      {
        controlText === '' ? <>
          <div>你的控制码{localCode}</div>
          <input type="text" value={remoteCode} onChange={e => setRemoteCode(e.target.value)} />
          <button onClick={() => startControl()}>确认</button>
        </> : <div>{controlText}</div>
      }
    </div>
  )
}

export default App
