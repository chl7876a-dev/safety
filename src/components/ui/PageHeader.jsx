/**
 * 모든 페이지 공통 헤더
 * props: title, subtitle, badge?, actions?
 */
export default function PageHeader({ title, subtitle, badge, actions }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      flexWrap: 'wrap', gap: '16px', marginBottom: '32px',
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <h2 style={{
            fontFamily: "'Noto Serif', serif", fontWeight: 800,
            fontSize: '1.75rem', color: '#111c2d', margin: 0, lineHeight: 1.2,
          }}>
            {title}
          </h2>
          {badge && (
            <span style={{
              background: '#dbeafe', color: '#094cb2',
              fontSize: '12px', fontWeight: 700,
              padding: '3px 10px', borderRadius: '999px',
              whiteSpace: 'nowrap',
            }}>
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p style={{
            fontSize: '14px', color: '#3d4356', lineHeight: 1.6,
            maxWidth: '560px', margin: 0, fontWeight: 500,
          }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {actions}
        </div>
      )}
    </div>
  )
}
