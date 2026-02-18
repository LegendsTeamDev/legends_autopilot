function StatusIndicator({ isActive }) {
  return (
    <div
      className="flex items-center justify-center gap-2 py-2 px-3 rounded"
      style={{
        background: 'var(--holo-bg-input)',
        border: '1px solid var(--holo-border-dim)'
      }}
    >
      <div
        className="w-2 h-2 rounded-full"
        style={{
          background: isActive ? 'var(--holo-cyan)' : 'var(--holo-border)'
        }}
      />
      <span
        className="text-xs"
        style={{
          color: isActive ? 'var(--holo-text-cyan)' : 'var(--holo-text-dim)'
        }}
      >
        {isActive ? 'Active' : 'Inactive'}
      </span>
    </div>
  )
}

export default StatusIndicator
