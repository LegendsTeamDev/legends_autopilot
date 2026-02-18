import StatusIndicator from './StatusIndicator'
import SpeedSlider from './SpeedSlider'
import DistanceSlider from './DistanceSlider'
import DrivingStyleSelect from './DrivingStyleSelect'

function AutopilotPanel({
  settings,
  isActive,
  hasWaypoint,
  isDriver,
  onClose,
  onStart,
  onStop,
  onSettingsChange
}) {
  const canStart = isDriver && hasWaypoint && !isActive

  const handleSpeedChange = (maxSpeed) => {
    onSettingsChange({ ...settings, maxSpeed })
  }

  const handleDistanceChange = (stoppingDistance) => {
    onSettingsChange({ ...settings, stoppingDistance })
  }

  const handleStyleChange = (drivingStyle) => {
    onSettingsChange({ ...settings, drivingStyle })
  }

  return (
    <div className="w-72 animate-slide-up">
      <div
        className="rounded-lg overflow-hidden"
        style={{
          background: 'var(--holo-bg-panel)',
          border: '1px solid var(--holo-border)'
        }}
      >
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: '1px solid var(--holo-border-dim)' }}
        >
          <span className="font-medium text-sm" style={{ color: 'var(--holo-text-cyan)' }}>
            Autopilot
          </span>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded transition-colors"
            style={{ color: 'var(--holo-text-dim)' }}
            onMouseEnter={(e) => e.target.style.color = 'var(--holo-cyan)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--holo-text-dim)'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-4 py-3 space-y-4">
          <StatusIndicator isActive={isActive} />

          <DrivingStyleSelect
            value={settings.drivingStyle}
            onChange={handleStyleChange}
            disabled={isActive}
          />

          <SpeedSlider
            value={settings.maxSpeed}
            onChange={handleSpeedChange}
            disabled={isActive}
          />

          <DistanceSlider
            value={settings.stoppingDistance}
            onChange={handleDistanceChange}
            disabled={isActive}
          />

          <div className="pt-1">
            {isActive ? (
              <button
                onClick={onStop}
                className="w-full py-2 px-4 rounded font-medium text-sm transition-colors flex items-center justify-center gap-2"
                style={{
                  background: 'rgba(239, 68, 68, 0.8)',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  color: 'var(--holo-text)'
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
                Stop
              </button>
            ) : (
              <button
                onClick={onStart}
                disabled={!canStart}
                className="w-full py-2 px-4 rounded font-medium text-sm transition-colors flex items-center justify-center gap-2"
                style={{
                  background: canStart ? 'rgba(34, 211, 238, 0.2)' : 'var(--holo-bg-input)',
                  border: canStart ? '1px solid var(--holo-border-bright)' : '1px solid var(--holo-border-dim)',
                  color: canStart ? 'var(--holo-text-cyan)' : 'var(--holo-text-dim)',
                  cursor: canStart ? 'pointer' : 'not-allowed'
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start
              </button>
            )}
          </div>

          {!isActive && (!isDriver || !hasWaypoint) && (
            <div
              className="flex items-start gap-2 px-3 py-2 rounded text-xs"
              style={{
                background: 'rgba(234, 179, 8, 0.1)',
                border: '1px solid rgba(234, 179, 8, 0.3)',
                color: 'rgba(253, 224, 71, 0.9)'
              }}
            >
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                {!isDriver && <p>Vehicle required</p>}
                {!hasWaypoint && <p>Waypoint not set</p>}
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-2" style={{ borderTop: '1px solid var(--holo-border-dim)' }}>
          <p className="text-xs text-center" style={{ color: 'var(--holo-text-dim)' }}>
            Press ESC to close
          </p>
        </div>
      </div>
    </div>
  )
}

export default AutopilotPanel
