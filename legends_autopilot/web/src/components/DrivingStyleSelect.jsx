const DRIVING_STYLES = [
  { value: 786603, label: 'Normal', description: 'Obeys traffic laws' },
  { value: 1074528293, label: 'Rushed', description: 'Fast, avoids obstacles' },
  { value: 6, label: 'Aggressive', description: 'Ignores traffic' }
]

function DrivingStyleSelect({ value, onChange, disabled }) {
  const handleChange = (e) => {
    onChange(parseInt(e.target.value, 10))
  }

  const currentStyle = DRIVING_STYLES.find(s => s.value === value) || DRIVING_STYLES[0]

  return (
    <div className={`space-y-1.5 ${disabled ? 'opacity-50' : ''}`}>
      <label className="text-xs block" style={{ color: 'var(--holo-text-dim)' }}>
        Driving Style
      </label>
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="w-full px-3 py-2 rounded text-sm appearance-none cursor-pointer transition-colors disabled:cursor-not-allowed"
        style={{
          background: 'var(--holo-bg-input)',
          border: '1px solid var(--holo-border-dim)',
          color: 'var(--holo-text-cyan)'
        }}
      >
        {DRIVING_STYLES.map((style) => (
          <option
            key={style.value}
            value={style.value}
            style={{
              background: 'rgb(8, 22, 40)',
              color: 'rgb(165, 230, 255)'
            }}
          >
            {style.label}
          </option>
        ))}
      </select>
      <p className="text-xs" style={{ color: 'var(--holo-text-dim)' }}>{currentStyle.description}</p>
    </div>
  )
}

export default DrivingStyleSelect
