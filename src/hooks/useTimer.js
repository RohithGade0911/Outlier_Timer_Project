import { useState, useEffect, useCallback } from 'react'

export const useTimer = (mode) => {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState([])

  useEffect(() => {
    let intervalId

    if (isRunning) {
      intervalId = setInterval(() => {
        setTime(prevTime => prevTime + 10) // Update every 10ms for smooth display
      }, 10)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isRunning])

  const start = useCallback(() => {
    setIsRunning(true)
  }, [])

  const stop = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    setTime(0)
    setIsRunning(false)
    setLaps([])
  }, [])

  const addLap = useCallback(() => {
    if (mode === 'stopwatch' && isRunning) {
      setLaps(prevLaps => [...prevLaps, time])
    }
  }, [mode, isRunning, time])

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
    start,
    stop,
    reset,
    addLap,
    formatTime
  }
} 