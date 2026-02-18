function DistanceSlider({ value, onChange, disabled }) {
  const handleChange = (e) => {
    onChange(parseFloat(e.target.value))
  }

  return (
    <div className={`space-y-1.5 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs" style={{ color: 'var(--holo-text-dim)' }}>
          Stop Distance
        </label>
        <span className="text-xs" style={{ color: 'var(--holo-text-cyan)' }}>
          {value}<span style={{ color: 'var(--holo-text-dim)' }}>m</span>
        </span>
      </div>
      <input
        type="range"
        min="2"
        max="20"
        step="1"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="w-full"
      />
      <div className="flex justify-between text-xs" style={{ color: 'var(--holo-text-dim)' }}>
        <span>2</span>
        <span>20</span>
      </div>
    </div>
  )
}

export default DistanceSlider
