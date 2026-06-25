/**
 * 안내 배너 (info / warning / error)
 */
const STYLES = {
  info:    { bg: '#f0f6ff', border: '#bfdbfe', icon: 'info',          iconColor: '#094cb2', textColor: '#1e3a6e' },
  warning: { bg: '#fffbeb', border: '#fde68a', icon: 'warning',       iconColor: '#b45309', textColor: '#78350f' },
  error:   { bg: '#fff1f2', border: '#fecdd3', icon: 'error',         iconColor: '#be123c', textColor: '#881337' },
  success: { bg: '#f0fdf4', border: '#bbf7d0', icon: 'check_circle',  iconColor: '#15803d', textColor: '#14532d' },
}

export default function InfoBanner({ type = 'info', children }) {
  const s = STYLES[type]
  return (
    <div style={{
      display: 'flex', gap: '12px', alignItems: 'flex-start',
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: '12px', padding: '14px 18px',
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: '20px', color: s.iconColor, flexShrink: 0, marginTop: '1px' }}>
        {s.icon}
      </span>
      <div style={{ fontSize: '13px', color: s.textColor, lineHeight: 1.6, fontWeight: 500 }}>
        {children}
      </div>
    </div>
  )
}
