import { createContext, useEffect, useRef, useState } from 'react'
import Timer from './Components/Timer'
import Modes from './Components/Modes'
import Settings from './Components/Settings'
import './App.css'


function App() {
  const MinutesContext = createContext({}) 

  const [ workMinutes, setWorkMinutes ] = useState(25)
  const [ shortBreakMinutes, setShortBreakMinutes ] = useState(5)
  const [ longBreakMinutes, setLongBreakMinutes ] = useState(15)

  return (
    <div className="App">
      <h1>pomodoro</h1>
      <MinutesContext.Provider value={{
        workMinutes,
        shortBreakMinutes,
        longBreakMinutes,
        setWorkMinutes,
        setShortBreakMinutes,
        setLongBreakMinutes
      }}>
        {/* <Modes /> */}
        <Timer 
          MinutesContext={MinutesContext}
        />
        <Settings 
          MinutesContext={MinutesContext}
        />
      </MinutesContext.Provider>
    </div>
  )
}

export default App
