import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTimer } from './hooks/useTimer'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [mode, setMode] = useState('stopwatch')
  const [isDarkMode, setIsDarkMode] = useState(false)
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

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className="w-[375px] h-[667px] bg-primary dark:bg-dark-primary rounded-3xl shadow-neu dark:shadow-neu-dark p-8 flex flex-col items-center transition-colors duration-200">
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 w-10 h-10 rounded-full shadow-neu dark:shadow-neu-dark flex items-center justify-center transition-all duration-200 hover:scale-110"
      >
        {isDarkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      {/* Mode Switcher */}
      <div 
        className={`mode-switch ${mode === 'timer' ? 'bg-accent dark:bg-dark-accent' : 'bg-secondary dark:bg-dark-secondary'}`}
        onClick={handleModeSwitch}
      >
        <motion.div
          className="mode-switch-handle"
          initial={false}
          animate={{
            x: mode === 'timer' ? '100%' : '0%',
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        />
      </div>

      {/* Mode Title */}
      <h1 className="text-2xl font-bold mt-4 text-gray-700 dark:text-gray-200">
        {mode === 'stopwatch' ? 'Stopwatch' : 'Timer'}
      </h1>

      {/* Time Display */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {mode === 'stopwatch' ? (
          <>
            <div className={`text-6xl font-bold mb-4 ${isCompleted ? 'text-accent dark:text-dark-accent' : 'text-gray-700 dark:text-gray-200'}`}>
              {`${formattedTime.hours}:${formattedTime.minutes}:${formattedTime.seconds}`}
              <span className="text-3xl">.{formattedTime.milliseconds}</span>
            </div>
            {laps.length > 0 && (
              <div className="w-full max-h-40 overflow-y-auto mt-4">
                {laps.map((lap, index) => {
                  const lapTime = formatTime(lap)
                  return (
                    <div key={index} className="flex justify-between items-center py-2 text-gray-700 dark:text-gray-200">
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
            <div className={`text-6xl font-bold mb-4 ${isCompleted ? 'text-accent dark:text-dark-accent' : 'text-gray-700 dark:text-gray-200'}`}>
              {`${formattedTime.hours}:${formattedTime.minutes}:${formattedTime.seconds}`}
            </div>
            <div className="flex gap-4 mt-4">
              <div className="flex flex-col items-center">
                <input
                  type="number"
                  className="neu-input dark:shadow-neu-dark-inset dark:bg-dark-primary dark:text-gray-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                  max="23"
                  placeholder="00"
                  value={timerInputs.hours}
                  onChange={(e) => handleInputChange('hours', e.target.value)}
                  disabled={isRunning}
                />
                <span className="text-sm mt-1 text-gray-700 dark:text-gray-200">Hours</span>
              </div>
              <span className="text-4xl self-end mb-2 text-gray-700 dark:text-gray-200">:</span>
              <div className="flex flex-col items-center">
                <input
                  type="number"
                  className="neu-input dark:shadow-neu-dark-inset dark:bg-dark-primary dark:text-gray-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                  max="59"
                  placeholder="00"
                  value={timerInputs.minutes}
                  onChange={(e) => handleInputChange('minutes', e.target.value)}
                  disabled={isRunning}
                />
                <span className="text-sm mt-1 text-gray-700 dark:text-gray-200">Minutes</span>
              </div>
              <span className="text-4xl self-end mb-2 text-gray-700 dark:text-gray-200">:</span>
              <div className="flex flex-col items-center">
                <input
                  type="number"
                  className="neu-input dark:shadow-neu-dark-inset dark:bg-dark-primary dark:text-gray-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                  max="59"
                  placeholder="00"
                  value={timerInputs.seconds}
                  onChange={(e) => handleInputChange('seconds', e.target.value)}
                  disabled={isRunning}
                />
                <span className="text-sm mt-1 text-gray-700 dark:text-gray-200">Seconds</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-8">
        <button 
          className={`neu-button dark:shadow-neu-dark ${isRunning ? 'bg-red-500 text-white' : 'bg-accent dark:bg-dark-accent text-white'}`}
          onClick={handleStartStop}
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <button 
          className="neu-button dark:shadow-neu-dark dark:bg-dark-secondary dark:text-gray-200"
          onClick={handleReset}
        >
          Reset
        </button>
        {mode === 'stopwatch' && (
          <button 
            className="neu-button dark:shadow-neu-dark dark:bg-dark-secondary dark:text-gray-200"
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
