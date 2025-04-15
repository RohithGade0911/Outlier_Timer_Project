import { useState, useEffect, useCallback, useRef } from 'react'

export const useTimer = (mode) => {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState([])
  const [timerDuration, setTimerDuration] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const intervalRef = useRef(null)
  const audioRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'))

  useEffect(() => {
    if (isRunning) {
      if (mode === 'stopwatch') {
        intervalRef.current = setInterval(() => {
          setTime(prevTime => prevTime + 10) // Update every 10ms for smooth display
        }, 10)
      } else if (mode === 'timer' && time > 0) {
        intervalRef.current = setInterval(() => {
          setTime(prevTime => {
            if (prevTime <= 10) {
              clearInterval(intervalRef.current)
              setIsRunning(false)
              setIsCompleted(true)
              audioRef.current.play().catch(e => console.log('Audio play failed:', e))
              return 0
            }
            return prevTime - 10
          })
        }, 10)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, mode, time])

  const start = useCallback(() => {
    setIsRunning(true)
    setIsCompleted(false)
  }, [])

  const stop = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    setTime(mode === 'timer' ? timerDuration : 0)
    setIsRunning(false)
    setLaps([])
    setIsCompleted(false)
  }, [mode, timerDuration])

  const addLap = useCallback(() => {
    if (mode === 'stopwatch' && isRunning) {
      setLaps(prevLaps => [...prevLaps, time])
    }
  }, [mode, isRunning, time])

  const setTimerTime = useCallback((hours, minutes, seconds) => {
    const totalMs = (hours * 3600 + minutes * 60 + seconds) * 1000
    setTimerDuration(totalMs)
    setTime(totalMs)
    setIsCompleted(false)
  }, [])

  const formatTime = useCallback((ms) => {
    const hours = Math.floor(ms / 3600000)
    const minutes = Math.floor((ms % 3600000) / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const milliseconds = Math.floor((ms % 1000) / 10)

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      milliseconds: milliseconds.toString().padStart(2, '0')
    }
  }, [])

  return {
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
  }
} 