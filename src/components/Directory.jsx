import { useState } from 'react'
import PageHeader from './ui/PageHeader'
import EmptyState from './ui/EmptyState'
import Card, { Badge } from './ui/Card'

/* ──────────────────────────────────
   가상 데이터 없음 — 실 데이터 주입 시
   props.people 배열로 전달받거나
   API 연동 후 setState로 채우세요.
   ────────────────────────────────── */

const STATUS_CONFIG = {
  '현장 근무': { bg: '#dcfce7', color: '#15803d', dot: '#16a34a' },
  '재택 근무': { bg: '#dbeafe', color: '#1d4ed8', dot: '#2563eb' },
  '출장 중':   { bg: '#fef9c3', color: '#854d0e', dot: '#d97706' },
}

function PersonCard({ person }) {
  const st = STATUS_CONFIG[person.status] ?? { bg: '#f1f5f9', color: '#3d4356', dot: '#94a3b8' }

  return (
    <Card style={{ transition: 'box-shadow 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(9,76,178,0.12)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(9,76,178,0.06)'}
    >
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* 상단: 아바타 + 이름 + 상태 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: '#dbeafe', color: '#094cb2',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '16px', flexShrink: 0,
            }}>
              {person.avatar || person.name?.slice(0, 2)}
            </div>
            <div>
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#111c2d', margin: 0 }}>{person.name}</p>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#094cb2', margin: '3px 0 0' }}>{person.role}</p>
            </div>
          </div>
          <span style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            background: st.bg, color: st.color,
            fontSize: '11px', fontWeight: 700, padding: '4px 10px',
            borderRadius: '999px', whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: st.dot }} />
            {person.status}
          </span>
        </div>

        {/* 구분선 */}
        <div style={{ height: '1px', background: '#f0f2fa' }} />

        {/* 연락처 정보 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { icon: 'mail',        value: person.email },
            { icon: 'location_on', value: person.site },
            person.phone && { icon: 'call', value: person.phone },
          ].filter(Boolean).map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#737784', flexShrink: 0 }}>
                {item.icon}
              </span>
              <span style={{ fontSize: '13px', color: '#3d4356',
                fontFamily: item.icon === 'mail' ? "'JetBrains Mono', monospace" : 'inherit',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* 버튼 */}
        <button style={{
          width: '100%', padding: '10px', borderRadius: '10px',
          background: '#f8faff', border: '1.5px solid #dde3f0',
          fontSize: '13px', fontWeight: 700, color: '#094cb2',
          cursor: 'pointer', transition: 'background 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#dbeafe'}
          onMouseLeave={e => e.currentTarget.style.background = '#f8faff'}
        >
          프로필 보기
        </button>
      </div>
    </Card>
  )
}

/* ── 메인 컴포넌트 ── */
export default function Directory({ people = [] }) {
  const [query, setQuery] = useState('')

  const filtered = people.filter((p) => {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return (
      (p.name  ?? '').toLowerCase().includes(q) ||
      (p.role  ?? '').toLowerCase().includes(q) ||
      (p.site  ?? '').toLowerCase().includes(q) ||
      (p.email ?? '').toLowerCase().includes(q)
    )
  })

  return (
    <div style={{ padding: '40px', maxWidth: '1440px', margin: '0 auto' }}>

      <PageHeader
        title="안전환경 담당자 명단 조회"
        subtitle="모든 사업장의 안전 및 환경 관리자를 신속하게 찾아 연락할 수 있습니다."
        badge={`${people.length}명 등록`}
      />

      {/* 검색창 */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          background: '#fff', border: '1.5px solid #c3c6d5',
          borderRadius: '14px', padding: '4px 8px 4px 16px',
          maxWidth: '560px', gap: '8px',
          boxShadow: '0 2px 8px rgba(9,76,178,0.06)',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#094cb2', flexShrink: 0 }}>
            person_search
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="성명, 사업장, 역할, 이메일로 검색..."
            style={{
              flex: 1, border: 'none', outline: 'none', fontSize: '14px',
              color: '#111c2d', background: 'transparent', padding: '10px 4px',
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#737784', display: 'flex', padding: '4px',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
            </button>
          )}
          <button style={{
            padding: '9px 20px', background: '#094cb2', color: '#fff',
            border: 'none', borderRadius: '10px', fontSize: '13px',
            fontWeight: 700, cursor: 'pointer', flexShrink: 0,
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#0a3d94'}
            onMouseLeave={e => e.currentTarget.style.background = '#094cb2'}
          >
            검색
          </button>
        </div>
        {query && (
          <p style={{ fontSize: '13px', color: '#737784', marginTop: '10px' }}>
            "<strong>{query}</strong>" 검색 결과: {filtered.length}명
          </p>
        )}
      </div>

      {/* 결과 */}
      {people.length === 0 ? (
        <EmptyState
          icon="group"
          title="등록된 담당자가 없습니다"
          description="담당자 관리 페이지에서 엑셀 업로드 또는 직접 입력으로 담당자를 먼저 등록해 주세요."
          action={
            <button style={{
              padding: '10px 24px', background: '#094cb2', color: '#fff',
              border: 'none', borderRadius: '10px', fontSize: '14px',
              fontWeight: 700, cursor: 'pointer',
            }}>
              담당자 등록하러 가기
            </button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="search_off"
          title="검색 결과가 없습니다"
          description={`'${query}'에 해당하는 담당자를 찾을 수 없습니다. 검색어를 다시 확인해 주세요.`}
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
        }}>
          {filtered.map((person) => (
            <PersonCard key={person.id ?? person.email} person={person} />
          ))}
        </div>
      )}
    </div>
  )
}
