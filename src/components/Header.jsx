import { useState } from 'react'

export default function Header() {
  const [query, setQuery] = useState('')

  return (
    <header
      className="glass-header border-b border-outline-variant sticky top-0 z-30"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: '64px',
        padding: '0 28px',
        background: 'rgba(249,249,255,0.85)',
        gap: '24px',
      }}
    >
      {/* 브랜드 타이틀 — 절대 줄바꿈 없이 */}
      <h2
        style={{
          fontFamily: "'Noto Serif', serif",
          fontWeight: 700,
          fontSize: '18px',
          color: '#094cb2',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          margin: 0,
          lineHeight: 1,
        }}
      >
        EnviroSafe 관리자
      </h2>

      {/* 오른쪽 영역 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, justifyContent: 'flex-end' }}>
        {/* 검색창 */}
        <div style={{ position: 'relative', width: '280px', flexShrink: 0 }}>
          <span
            className="material-symbols-outlined"
            style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)', fontSize: '18px', color: '#737784',
            }}
          >
            search
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색어를 입력하세요..."
            style={{
              width: '100%', paddingLeft: '40px', paddingRight: '16px',
              paddingTop: '8px', paddingBottom: '8px',
              background: '#f0f3ff', border: '1px solid #c3c6d5',
              borderRadius: '999px', fontSize: '13px', color: '#111c2d',
              outline: 'none', transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = '#094cb2'}
            onBlur={e => e.target.style.borderColor = '#c3c6d5'}
          />
        </div>

        {/* 아이콘 버튼들 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {['notifications', 'settings'].map(icon => (
            <button
              key={icon}
              style={{
                padding: '8px', background: 'none', border: 'none',
                borderRadius: '50%', cursor: 'pointer', color: '#737784',
                display: 'flex', alignItems: 'center', transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f0f3ff'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{icon}</span>
            </button>
          ))}

          {/* 아바타 */}
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: '#c5e0fe', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#49637d', fontWeight: 700,
            fontSize: '13px', border: '1px solid #c3c6d5', marginLeft: '4px',
            flexShrink: 0,
          }}>
            관
          </div>
        </div>
      </div>
    </header>
  )
}
