import { useEffect, useRef, useState } from 'react'
import Timer from './Components/Timer'
import Modes from './Components/Modes'
import Settings from './Components/Settings'
import './App.css'


function App() {
  const [ minutes, setMinutes ] = useState(60)
  return (
    <div className="App">
      <h1>pomodoro</h1>
      {/* <Modes /> */}
      <Timer 
        value={minutes}
      />
      <Settings />
    </div>
  )
}

export default App
