import React from 'react'
import ReactDOM from 'react-dom/client'
import BadApple from './components/BadApple/BadApple'
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
      <BadApple width={80} height={50} customStyles={{
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
      }} />
    </div>
  </React.StrictMode>
)
