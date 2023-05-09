import React from 'react'
import AsciiTheater from './components/AsciiTheater/AsciiTheater'
import './App.css'

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
export default function App() {
  return (
    <React.StrictMode>
        }}
        loop
      />
    </div>
    </React.StrictMode>
  )
}
