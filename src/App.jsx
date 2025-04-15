import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTimer } from './hooks/useTimer'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [mode, setMode] = useState('stopwatch')
  const [timerInputs, setTimerInputs] = useState({ hours: '', minutes: '', seconds: '' })
  const { time, isRunning, laps, start, stop, reset, addLap, formatTime } = useTimer(mode)
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
      start()
    }
  }

  return (
    <div className="w-[375px] h-[667px] bg-primary rounded-3xl shadow-neu p-8 flex flex-col items-center">
      {/* Mode Switcher */}
      <div 
        className={`mode-switch ${mode === 'timer' ? 'bg-accent' : 'bg-secondary'}`}
        onClick={() => {
          setMode(mode === 'stopwatch' ? 'timer' : 'stopwatch')
          reset()
        }}
      >
        <motion.div
          className="mode-switch-handle"
          animate={{
            x: mode === 'timer' ? '100%' : '0%',
          }}
        />
      </div>

      {/* Time Display */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {mode === 'stopwatch' ? (
          <>
            <div className="text-6xl font-bold mb-4">
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
          <div className="flex gap-4">
            <input
              type="number"
              className="neu-input"
              min="0"
              max="59"
              placeholder="00"
              value={timerInputs.hours}
              onChange={(e) => handleInputChange('hours', e.target.value)}
              disabled={isRunning}
            />
            <span className="text-4xl">:</span>
            <input
              type="number"
              className="neu-input"
              min="0"
              max="59"
              placeholder="00"
              value={timerInputs.minutes}
              onChange={(e) => handleInputChange('minutes', e.target.value)}
              disabled={isRunning}
            />
            <span className="text-4xl">:</span>
            <input
              type="number"
              className="neu-input"
              min="0"
              max="59"
              placeholder="00"
              value={timerInputs.seconds}
              onChange={(e) => handleInputChange('seconds', e.target.value)}
              disabled={isRunning}
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button 
          className={`neu-button ${isRunning ? 'bg-red-500 text-white' : 'bg-accent text-white'}`}
          onClick={handleStartStop}
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <button 
          className="neu-button"
          onClick={reset}
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
