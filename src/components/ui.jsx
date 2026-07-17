export function GeometricAccent({ position = 'tr', size = 140 }) {
  const isTR = position === 'tr'
  return (
    <div
      className="geo-accent"
      style={{
        width: size,
        height: size * 0.7,
        top: isTR ? 0 : 'auto',
        right: isTR ? 0 : 'auto',
        bottom: isTR ? 'auto' : 0,
        left: isTR ? 'auto' : 0,
      }}
      aria-hidden
    >
      <span
        style={{
          width: size * 0.22,
          height: size,
          background: '#7bd5f5',
          top: isTR ? -20 : -10,
          [isTR ? 'right' : 'left']: 8,
          opacity: 0.95,
        }}
      />
      <span
        style={{
          width: size * 0.18,
          height: size,
          background: '#4db8e8',
          top: isTR ? -10 : 0,
          [isTR ? 'right' : 'left']: size * 0.28,
          opacity: 0.9,
        }}
      />
      <span
        style={{
          width: size * 0.14,
          height: size,
          background: '#2f8fd4',
          top: isTR ? 0 : 10,
          [isTR ? 'right' : 'left']: size * 0.48,
          opacity: 0.85,
        }}
      />
      <span
        style={{
          width: size * 0.1,
          height: size,
          background: '#1e4a6e',
          top: isTR ? 12 : 20,
          [isTR ? 'right' : 'left']: size * 0.64,
          opacity: 0.8,
        }}
      />
    </div>
  )
}

export function BrandLogo({ size = 48, withName = false, light = false }) {
  return (
    <div className="brand-mark" style={{ color: light ? 'white' : 'var(--slate)' }}>
      <img
        src="/logo.png"
        alt="KudiCart"
        className="brand-logo"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          background: '#EBF5FB',
          boxShadow: light
            ? '0 4px 14px rgba(15, 36, 56, 0.22)'
            : '0 6px 16px rgba(47, 143, 212, 0.22)',
        }}
      />
      {withName && <span style={{ fontSize: size * 0.42 }}>KudiCart</span>}
    </div>
  )
}

export function Stars({ value = 5, size = 14 }) {
  const full = Math.round(value)
  return (
    <span className="stars" aria-label={`${value} stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < full ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  )
}

export function Toast({ message, onDone }) {
  if (!message) return null
  setTimeout(() => onDone?.(), 2200)
  return <div className="toast">{message}</div>
}

export function PhoneShell({ children, nav }) {
  return (
    <div className="phone-stage paper-bg">
      <div className="phone-shell paper-bg">
        <div className="phone-scroll">{children}</div>
        {nav}
      </div>
    </div>
  )
}

export function BottomNav({ items, active, onChange }) {
  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const Icon = item.icon
        const isActive = active === item.id
        return (
          <button key={item.id} className={isActive ? 'active' : ''} onClick={() => onChange(item.id)} type="button">
            <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}
