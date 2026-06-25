/**
 * 공용 카드 래퍼
 * props: children, padding?, style?
 */
export default function Card({ children, padding = '0', style = {} }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #dde3f0',
      borderRadius: '16px',
      boxShadow: '0 2px 8px rgba(9,76,178,0.06)',
      overflow: 'hidden',
      padding,
      ...style,
    }}>
      {children}
    </div>
  )
}

/**
 * 카드 헤더 영역
 */
export function CardHeader({ title, subtitle, right }) {
  return (
    <div style={{
      padding: '18px 24px',
      borderBottom: '1px solid #e8ecf8',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      gap: '12px', flexWrap: 'wrap',
      background: '#fafbff',
    }}>
      <div>
        <p style={{ fontSize: '15px', fontWeight: 700, color: '#111c2d', margin: 0 }}>{title}</p>
        {subtitle && (
          <p style={{ fontSize: '12px', color: '#737784', margin: '3px 0 0', fontWeight: 500 }}>{subtitle}</p>
        )}
      </div>
      {right && <div style={{ flexShrink: 0 }}>{right}</div>}
    </div>
  )
}

/**
 * 공용 뱃지
 */
export function Badge({ children, color = 'blue' }) {
  const palettes = {
    blue:   { bg: '#dbeafe', text: '#094cb2' },
    green:  { bg: '#dcfce7', text: '#15803d' },
    yellow: { bg: '#fef9c3', text: '#854d0e' },
    red:    { bg: '#ffe4e6', text: '#be123c' },
    gray:   { bg: '#f1f5f9', text: '#3d4356' },
  }
  const p = palettes[color] ?? palettes.gray
  return (
    <span style={{
      background: p.bg, color: p.text,
      fontSize: '11px', fontWeight: 700,
      padding: '3px 10px', borderRadius: '999px', whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  )
}

/**
 * 공용 버튼
 */
export function Btn({ children, variant = 'primary', onClick, disabled, icon, style = {} }) {
  const variants = {
    primary:   { background: '#094cb2', color: '#fff', border: 'none' },
    secondary: { background: '#fff', color: '#094cb2', border: '1.5px solid #094cb2' },
    ghost:     { background: 'transparent', color: '#3d4356', border: '1.5px solid #dde3f0' },
    danger:    { background: '#fff', color: '#be123c', border: '1.5px solid #be123c' },
  }
  const v = variants[variant] ?? variants.ghost
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '9px 18px', borderRadius: '10px',
        fontSize: '13px', fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1, whiteSpace: 'nowrap',
        transition: 'all 0.15s', ...v, ...style,
      }}
    >
      {icon && <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{icon}</span>}
      {children}
    </button>
  )
}
