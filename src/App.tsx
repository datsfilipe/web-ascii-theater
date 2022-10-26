import React from 'react'
import ReactDOM from 'react-dom/client'
import BadApple from './components/BadApple/BadApple'
import './App.css'

const currentDir = new URL('.', import.meta.url).pathname

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div
      className="App"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}
    >
      <BadApple
        width={80}
        height={50}
        framesDir={`${currentDir}assets/frames`}
        customStyles={{
          fontFamily: 'monospace',
          fontSize: '10px',
          width: 'fit-content',
          height: 'fit-content',
          overflow: 'auto',
          margin: 0,
          padding: 0,
          backgroundColor: 'black',
          color: 'white',
          textAlign: 'center'
        }}
        loop
      />
    </div>
  </React.StrictMode>
)
