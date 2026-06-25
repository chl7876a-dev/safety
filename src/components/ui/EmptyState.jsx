/**
 * 데이터 없음 상태 공용 컴포넌트
 * props: icon, title, description, action?
 */
export default function EmptyState({ icon = 'inbox', title = '데이터가 없습니다', description, action }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '64px 24px', gap: '16px', textAlign: 'center',
    }}>
      <div style={{
        width: '72px', height: '72px', borderRadius: '50%',
        background: '#f0f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '36px', color: '#737784' }}>
          {icon}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ fontSize: '16px', fontWeight: 700, color: '#111c2d', margin: 0 }}>{title}</p>
        {description && (
          <p style={{ fontSize: '14px', color: '#737784', margin: 0, lineHeight: 1.6, maxWidth: '360px' }}>
            {description}
          </p>
        )}
      </div>
      {action && <div style={{ marginTop: '8px' }}>{action}</div>}
    </div>
  )
}
