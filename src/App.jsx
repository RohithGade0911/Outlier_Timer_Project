import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTimer } from './hooks/useTimer'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import imageStart from './assets/image_start.png'
import imageEnd from './assets/image_end.png'
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
        const hours = parseInt(timerInputs.hours) || 0
        const minutes = parseInt(timerInputs.minutes) || 0
        const seconds = parseInt(timerInputs.seconds) || 0
        
        if (hours === 0 && minutes === 0 && seconds === 0) {
          return
        }
        
        setTimerTime(hours, minutes, seconds)
      }
      start()
    }
  }

  const handleModeSwitch = (newMode) => {
    setMode(newMode)
    reset()
    setTimerInputs({ hours: '', minutes: '', seconds: '' })
  }

  const handleReset = () => {
    reset()
    setTimerInputs({ hours: '', minutes: '', seconds: '' })
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const modeTextVariants = {
    inactive: {
      scale: 1,
      opacity: 0.6,
      y: 0,
    },
    active: {
      scale: 1.1,
      opacity: 1,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  }

  return (
    <div className="w-[375px] h-[667px] bg-primary dark:bg-dark-primary rounded-3xl shadow-neu dark:shadow-neu-dark p-8 flex flex-col items-center transition-colors duration-200 relative overflow-hidden">
      {/* Background Images Container */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {isRunning && (
            <motion.img
              src={imageStart}
              alt="Start"
              className="absolute w-32 h-32 right-0 top-1/2 -translate-y-1/2"
              initial={{ x: "100%", rotate: -15, opacity: 0 }}
              animate={{ x: "0%", rotate: 0, opacity: 1 }}
              exit={{ x: "100%", rotate: -15, opacity: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
            />
          )}
          {!isRunning && time > 0 && (
            <motion.img
              src={imageEnd}
              alt="End"
              className="absolute w-32 h-32 left-0 top-1/2 -translate-y-1/2"
              initial={{ x: "-100%", rotate: 15, opacity: 0 }}
              animate={{ x: "0%", rotate: 0, opacity: 1 }}
              exit={{ x: "-100%", rotate: 15, opacity: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 w-10 h-10 rounded-full shadow-neu dark:shadow-neu-dark flex items-center justify-center transition-all duration-200 hover:scale-110 bg-primary dark:bg-dark-primary z-10"
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

      {/* Rest of the content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Mode Selector */}
        <div className="flex flex-col items-center gap-2 mt-4">
          <motion.div
            className="cursor-pointer"
            onClick={() => handleModeSwitch('stopwatch')}
            variants={modeTextVariants}
            animate={mode === 'stopwatch' ? 'active' : 'inactive'}
            whileHover={{ scale: 1.05 }}
          >
            <h2 className={`text-2xl font-bold ${mode === 'stopwatch' ? 'text-accent dark:text-dark-accent' : 'text-gray-700 dark:text-gray-400'}`}>
              Stopwatch
            </h2>
          </motion.div>
          <motion.div
            className="cursor-pointer"
            onClick={() => handleModeSwitch('timer')}
            variants={modeTextVariants}
            animate={mode === 'timer' ? 'active' : 'inactive'}
            whileHover={{ scale: 1.05 }}
          >
            <h2 className={`text-2xl font-bold ${mode === 'timer' ? 'text-accent dark:text-dark-accent' : 'text-gray-700 dark:text-gray-400'}`}>
              Timer
            </h2>
          </motion.div>
        </div>

        {/* Time Display */}
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <AnimatePresence mode="wait">
            {mode === 'stopwatch' ? (
              <motion.div
                key="stopwatch"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <div className={`text-6xl font-bold mb-4 ${isCompleted ? 'text-accent dark:text-dark-accent' : 'text-gray-700 dark:text-gray-200'}`}>
                  {`${formattedTime.hours}:${formattedTime.minutes}:${formattedTime.seconds}`}
                  <span className="text-3xl">.{formattedTime.milliseconds}</span>
                </div>
                {laps.length > 0 && (
                  <motion.div 
                    className="w-full max-h-40 overflow-y-auto mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {laps.map((lap, index) => {
                      const lapTime = formatTime(lap)
                      return (
                        <motion.div 
                          key={index} 
                          className="flex justify-between items-center py-2 text-gray-700 dark:text-gray-200"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <span>Lap {index + 1}</span>
                          <span>{`${lapTime.hours}:${lapTime.minutes}:${lapTime.seconds}.${lapTime.milliseconds}`}</span>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="timer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <div className={`text-6xl font-bold mb-4 ${isCompleted ? 'text-accent dark:text-dark-accent' : 'text-gray-700 dark:text-gray-200'}`}>
                  {`${formattedTime.hours}:${formattedTime.minutes}:${formattedTime.seconds}`}
                </div>
                <div className="flex gap-4 mt-4">
                  <motion.div 
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
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
                    <span className="text-sm font-medium mt-2 text-gray-700 dark:text-gray-200">Hours</span>
                  </motion.div>
                  <span className="text-4xl self-end mb-2 text-gray-700 dark:text-gray-200">:</span>
                  <motion.div 
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
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
                    <span className="text-sm font-medium mt-2 text-gray-700 dark:text-gray-200">Minutes</span>
                  </motion.div>
                  <span className="text-4xl self-end mb-2 text-gray-700 dark:text-gray-200">:</span>
                  <motion.div 
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
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
                    <span className="text-sm font-medium mt-2 text-gray-700 dark:text-gray-200">Seconds</span>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mt-8">
          <motion.button 
            className={`neu-button dark:shadow-neu-dark ${isRunning ? 'bg-red-500 text-white' : 'bg-accent dark:bg-dark-accent text-white'}`}
            onClick={handleStartStop}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isRunning ? 'Stop' : 'Start'}
          </motion.button>
          <motion.button 
            className="neu-button dark:shadow-neu-dark dark:bg-dark-secondary dark:text-gray-200"
            onClick={handleReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset
          </motion.button>
          {mode === 'stopwatch' && (
            <motion.button 
              className="neu-button dark:shadow-neu-dark dark:bg-dark-secondary dark:text-gray-200"
              onClick={addLap}
              disabled={!isRunning}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Lap
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
