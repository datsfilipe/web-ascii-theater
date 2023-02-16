import React from 'react'
import ReactDOM from 'react-dom/client'
import AsciiTheater from './components/AsciiTheater/AsciiTheater'
import './App.css'

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
      <AsciiTheater
        width={80}
        height={50}
        framesDir={'/frames'}
        framesCount={5478}
        customStyles={{
          fontSize: '9px',
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
