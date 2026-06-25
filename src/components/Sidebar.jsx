const navItems = [
  { id: 'dashboard', icon: 'dashboard', label: '대시보드' },
  { id: 'personnel', icon: 'group', label: '담당자 관리' },
  { id: 'directory', icon: 'person_search', label: '명단 조회' },
  { id: 'masterlist', icon: 'assignment_turned_in', label: '마스터 명단' },
]

export default function Sidebar({ activeView, onNavigate }) {
  return (
    <aside
      style={{
        width: '280px',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
        borderRight: '1px solid #c3c6d5',
        zIndex: 40,
        padding: '0',
        overflowY: 'auto',
      }}
    >
      {/* 로고 영역 — 충분한 패딩으로 헤더 높이(64px)에 맞춤 */}
      <div style={{
        padding: '18px 24px 20px',
        borderBottom: '1px solid #e7eeff',
        minHeight: '64px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <h1 style={{
          fontFamily: "'Noto Serif', serif",
          fontWeight: 800,
          fontSize: '20px',
          color: '#111c2d',
          margin: 0,
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
        }}>
          SafetyOS
        </h1>
        <p style={{
          fontSize: '12px',
          fontWeight: 600,
          color: '#737784',
          marginTop: '4px',
          letterSpacing: '0.02em',
          whiteSpace: 'nowrap',
        }}>
          Corporate Fleet
        </p>
      </div>

      {/* 네비게이션 */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 16px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 0.15s',
                background: isActive ? '#c5e0fe' : 'transparent',
                color: isActive ? '#49637d' : '#434653',
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.background = '#dee8ff'
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.background = 'transparent'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px', flexShrink: 0 }}>
                {item.icon}
              </span>
              <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* 하단 유틸 */}
      <div style={{
        padding: '12px 12px 20px',
        borderTop: '1px solid #e7eeff',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}>
        {[
          { icon: 'help', label: '고객 지원' },
          { icon: 'logout', label: '로그아웃' },
        ].map(({ icon, label }) => (
          <a
            key={label}
            href="#"
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 16px', borderRadius: '12px',
              fontSize: '14px', fontWeight: 600, color: '#434653',
              textDecoration: 'none', transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#dee8ff'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px', flexShrink: 0 }}>{icon}</span>
            <span style={{ whiteSpace: 'nowrap' }}>{label}</span>
          </a>
        ))}
      </div>
    </aside>
  )
}
