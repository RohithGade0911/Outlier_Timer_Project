import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTimer } from './hooks/useTimer'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [mode, setMode] = useState('stopwatch')
  const [timerInputs, setTimerInputs] = useState({ hours: '', minutes: '', seconds: '' })
  const { 
    time, 
    isRunning, 
    laps, 
    isCompleted,
    start, 
    stop, 
    reset, 
    addLap, 
    setTimerTime,
    formatTime 
  } = useTimer(mode)
  
  const formattedTime = formatTime(time)

  const handleInputChange = (field, value) => {
    const numValue = parseInt(value) || ''
    if (numValue === '' || (numValue >= 0 && numValue <= 59)) {
      setTimerInputs(prev => ({ ...prev, [field]: numValue }))
    }
  }

  const handleStartStop = () => {
    if (isRunning) {
      stop()
    } else {
      if (mode === 'timer' && time === 0) {
        // Set the timer duration from inputs before starting
        const hours = parseInt(timerInputs.hours) || 0
        const minutes = parseInt(timerInputs.minutes) || 0
        const seconds = parseInt(timerInputs.seconds) || 0
        
        if (hours === 0 && minutes === 0 && seconds === 0) {
          return // Don't start if no time is set
        }
        
        setTimerTime(hours, minutes, seconds)
      }
      start()
    }
  }

  const handleModeSwitch = () => {
    const newMode = mode === 'stopwatch' ? 'timer' : 'stopwatch'
    setMode(newMode)
    reset()
    // Clear timer inputs when switching modes
    setTimerInputs({ hours: '', minutes: '', seconds: '' })
  }

  const handleReset = () => {
    reset()
    // Clear timer inputs when resetting
    setTimerInputs({ hours: '', minutes: '', seconds: '' })
  }

  return (
    <div className="w-[375px] h-[667px] bg-primary rounded-3xl shadow-neu p-8 flex flex-col items-center">
      {/* Mode Switcher */}
      <div 
        className={`mode-switch ${mode === 'timer' ? 'bg-accent' : 'bg-secondary'}`}
        onClick={handleModeSwitch}
      >
        <motion.div
          className="mode-switch-handle"
          animate={{
            x: mode === 'timer' ? '100%' : '0%',
          }}
        />
      </div>

      {/* Mode Title */}
      <h1 className="text-2xl font-bold mt-4 text-gray-700">
        {mode === 'stopwatch' ? 'Stopwatch' : 'Timer'}
      </h1>

      {/* Time Display */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {mode === 'stopwatch' ? (
          <>
            <div className={`text-6xl font-bold mb-4 ${isCompleted ? 'text-accent' : ''}`}>
              {`${formattedTime.hours}:${formattedTime.minutes}:${formattedTime.seconds}`}
              <span className="text-3xl">.{formattedTime.milliseconds}</span>
            </div>
            {laps.length > 0 && (
              <div className="w-full max-h-40 overflow-y-auto mt-4">
                {laps.map((lap, index) => {
                  const lapTime = formatTime(lap)
                  return (
                    <div key={index} className="flex justify-between items-center py-2">
                      <span>Lap {index + 1}</span>
                      <span>{`${lapTime.hours}:${lapTime.minutes}:${lapTime.seconds}.${lapTime.milliseconds}`}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center">
            <div className={`text-6xl font-bold mb-4 ${isCompleted ? 'text-accent' : ''}`}>
              {`${formattedTime.hours}:${formattedTime.minutes}:${formattedTime.seconds}`}
            </div>
            <div className="flex gap-4 mt-4">
              <div className="flex flex-col items-center">
                <input
                  type="number"
                  className="neu-input [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                  max="23"
                  placeholder="00"
                  value={timerInputs.hours}
                  onChange={(e) => handleInputChange('hours', e.target.value)}
                  disabled={isRunning}
                />
                <span className="text-sm mt-1">Hours</span>
              </div>
              <span className="text-4xl self-end mb-2">:</span>
              <div className="flex flex-col items-center">
                <input
                  type="number"
                  className="neu-input [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                  max="59"
                  placeholder="00"
                  value={timerInputs.minutes}
                  onChange={(e) => handleInputChange('minutes', e.target.value)}
                  disabled={isRunning}
                />
                <span className="text-sm mt-1">Minutes</span>
              </div>
              <span className="text-4xl self-end mb-2">:</span>
              <div className="flex flex-col items-center">
                <input
                  type="number"
                  className="neu-input [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                  max="59"
                  placeholder="00"
                  value={timerInputs.seconds}
                  onChange={(e) => handleInputChange('seconds', e.target.value)}
                  disabled={isRunning}
                />
                <span className="text-sm mt-1">Seconds</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-8">
        <button 
          className={`neu-button ${isRunning ? 'bg-red-500 text-white' : 'bg-accent text-white'}`}
          onClick={handleStartStop}
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <button 
          className="neu-button"
          onClick={handleReset}
        >
          Reset
        </button>
        {mode === 'stopwatch' && (
          <button 
            className="neu-button"
            onClick={addLap}
            disabled={!isRunning}
          >
            Lap
          </button>
        )}
      </div>
    </div>
  )
}

export default App
