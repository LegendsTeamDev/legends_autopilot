import { useState, useEffect, useCallback } from 'react'
import AutopilotPanel from './components/AutopilotPanel'

const DEFAULT_SETTINGS = {
  maxSpeed: 45.0,
  drivingStyle: 1074528293,
  stoppingDistance: 5.0
}

function App() {
  const [visible, setVisible] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [hasWaypoint, setHasWaypoint] = useState(false)
  const [isDriver, setIsDriver] = useState(false)
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  const handleMessage = useCallback((event) => {
    const { action, data } = event.data

    switch (action) {
      case 'open':
        setSettings(data.settings || DEFAULT_SETTINGS)
        setIsActive(data.isActive || false)
        setHasWaypoint(data.hasWaypoint || false)
        setIsDriver(data.isDriver || false)
        setVisible(true)
        break

      case 'close':
        setVisible(false)
        break

      case 'updateState':
        if (data.isActive !== undefined) setIsActive(data.isActive)
        if (data.hasWaypoint !== undefined) setHasWaypoint(data.hasWaypoint)
        if (data.isDriver !== undefined) setIsDriver(data.isDriver)
        break

      default:
        break
    }
  }, [])

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleMessage])

  const handleClose = useCallback(() => {
    setVisible(false)
    fetch('https://legends_autopilot/close', { method: 'POST' })
  }, [])

  const handleStart = useCallback(() => {
    fetch('https://legends_autopilot/startAutopilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings })
    })
  }, [settings])

  const handleStop = useCallback(() => {
    fetch('https://legends_autopilot/stopAutopilot', { method: 'POST' })
    setIsActive(false)
  }, [])

  const handleSettingsChange = useCallback((newSettings) => {
    setSettings(newSettings)
    fetch('https://legends_autopilot/saveSettings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings: newSettings })
    })
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && visible) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [visible, handleClose])

  if (!visible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <AutopilotPanel
        settings={settings}
        isActive={isActive}
        hasWaypoint={hasWaypoint}
        isDriver={isDriver}
        onClose={handleClose}
        onStart={handleStart}
        onStop={handleStop}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  )
}

export default App
