function SpeedSlider({ value, onChange, disabled }) {
  const kmh = Math.round(value * 3.6)
  const mph = Math.round(kmh * 0.621371)

  const handleChange = (e) => {
    const newKmh = parseInt(e.target.value, 10)
    onChange(newKmh / 3.6)
  }

  return (
    <div className={`space-y-1.5 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs" style={{ color: 'var(--holo-text-dim)' }}>
          Max Speed
        </label>
        <span className="text-xs" style={{ color: 'var(--holo-text-cyan)' }}>
          {kmh} <span style={{ color: 'var(--holo-text-dim)' }}>km/h</span> / {mph} <span style={{ color: 'var(--holo-text-dim)' }}>mph</span>
        </span>
      </div>
      <input
        type="range"
        min="20"
        max="160"
        step="5"
        value={kmh}
        onChange={handleChange}
        disabled={disabled}
        className="w-full"
      />
      <div className="flex justify-between text-xs" style={{ color: 'var(--holo-text-dim)' }}>
        <span>20</span>
        <span>160</span>
      </div>
    </div>
  )
}

export default SpeedSlider
