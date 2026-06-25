/* ─────────────────────────────────────────────
   색상 팔레트 (WCAG AA 기준 contrast ≥ 4.5:1)
   ───────────────────────────────────────────── */
const COLORS = {
  primary:   '#094cb2',   // Deep Blue (AA ✓ on white)
  teal:      '#0f766e',   // Teal-700  (AA ✓ on white)
  amber:     '#b45309',   // Amber-700 (AA ✓ on white)
  rose:      '#be123c',   // Rose-700  (AA ✓ on white)
  text:      '#111c2d',   // on-surface
  textSub:   '#3d4356',   // darker variant (AA ✓)
}

/* ─────────── KPI 카드 데이터 ─────────── */
const stats = [
  {
    label: '전체 대상 회사',
    value: '142',
    unit: '개',
    icon: 'business',
    iconBg: '#dbeafe',
    iconColor: COLORS.primary,
    sub: '이번 달 +4 증가',
    subIcon: 'trending_up',
    subColor: '#15803d',        // green-700  AA ✓
    accentColor: COLORS.primary,
  },
  {
    label: '제출 완료',
    value: '98',
    unit: '건',
    icon: 'task_alt',
    iconBg: '#ccfbf1',
    iconColor: COLORS.teal,
    sub: '제출률 69%',
    subColor: COLORS.textSub,
    accentColor: COLORS.teal,
  },
  {
    label: '검수 대기',
    value: '24',
    unit: '건',
    icon: 'pending_actions',
    iconBg: '#fef3c7',
    iconColor: COLORS.amber,
    sub: '평균 대기: 2.4일',
    subColor: COLORS.textSub,
    accentColor: COLORS.amber,
  },
  {
    label: '최종 확정',
    value: '1,204',
    unit: '명',
    icon: 'verified',
    iconBg: '#ffe4e6',
    iconColor: COLORS.rose,
    sub: '연간 누적 총계',
    subColor: COLORS.textSub,
    accentColor: COLORS.rose,
  },
]

/* ─────────── 바 차트 데이터 ─────────── */
const barData = [
  { month: '1월', pct: 40 },
  { month: '2월', pct: 55 },
  { month: '3월', pct: 48 },
  { month: '4월', pct: 72 },
  { month: '5월', pct: 85 },
  { month: '6월', pct: 92 },
]

/* ─────────── 도넛 범례 데이터 ─────────── */
const donutLegend = [
  { label: '준수 완료', pct: 94.2, color: COLORS.primary,  bg: '#dbeafe' },
  { label: '개선 필요', pct: 4.1,  color: COLORS.amber,    bg: '#fef3c7' },
  { label: '미제출',   pct: 1.7,  color: COLORS.rose,     bg: '#ffe4e6' },
]

/* ─────────── 최근 제출 테이블 ─────────── */
const recentRows = [
  { co: 'EcoLogistics Int.',  name: 'Sarah Chen',    date: '2026-06-24', status: '검수 완료', statusBg: '#dcfce7', statusColor: '#15803d' },
  { co: 'SafeWork Korea',     name: '김민준',         date: '2026-06-23', status: '검수 중',   statusBg: '#fef9c3', statusColor: '#854d0e' },
  { co: 'EnviroTech Co.',     name: '박지수',         date: '2026-06-22', status: '미제출',    statusBg: '#ffe4e6', statusColor: '#be123c' },
  { co: 'GreenField Ltd.',    name: 'Marcus Thorne', date: '2026-06-21', status: '검수 완료', statusBg: '#dcfce7', statusColor: '#15803d' },
]

/* ─── 공통 섹션 레이블 ─── */
function SectionLabel({ children }) {
  return (
    <p style={{ color: COLORS.textSub, fontSize: '12px', fontWeight: 700,
      letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>
      {children}
    </p>
  )
}

/* ─── KPI 카드 ─── */
function KpiCard({ s }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #dde3f0',
      borderRadius: '16px',
      borderTop: `4px solid ${s.accentColor}`,
      padding: '28px',
      boxShadow: '0 2px 8px rgba(9,76,178,0.07), 0 1px 2px rgba(0,0,0,0.04)',
      transition: 'box-shadow 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(9,76,178,0.12), 0 2px 4px rgba(0,0,0,0.06)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(9,76,178,0.07), 0 1px 2px rgba(0,0,0,0.04)'}
    >
      {/* 라벨 + 아이콘 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <span style={{
          fontSize: '13px', fontWeight: 700, color: COLORS.textSub,
          lineHeight: '1.4', maxWidth: '68%', wordBreak: 'keep-all',
        }}>
          {s.label}
        </span>
        <div style={{
          padding: '10px', borderRadius: '12px', background: s.iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '22px', color: s.iconColor }}>
            {s.icon}
          </span>
        </div>
      </div>

      {/* 큰 숫자 */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '10px' }}>
        <span style={{ fontSize: '2.75rem', fontWeight: 800, color: COLORS.text,
          fontFamily: "'Noto Serif', serif", lineHeight: 1 }}>
          {s.value}
        </span>
        <span style={{ fontSize: '15px', fontWeight: 600, color: COLORS.textSub }}>{s.unit}</span>
      </div>

      {/* 부연 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: s.subColor }}>
        {s.subIcon && (
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{s.subIcon}</span>
        )}
        <span style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.4 }}>{s.sub}</span>
      </div>
    </div>
  )
}

/* ─── 바 차트 ─── */
function BarChart() {
  const maxPct = Math.max(...barData.map(b => b.pct))
  const yTicks = [0, 25, 50, 75, 100]

  return (
    <div style={{
      background: '#ffffff', border: '1px solid #dde3f0', borderRadius: '16px',
      boxShadow: '0 2px 8px rgba(9,76,178,0.07)',
      overflow: 'hidden', gridColumn: 'span 2',
    }}>
      {/* 헤더 */}
      <div style={{ padding: '20px 28px', borderBottom: '1px solid #dde3f0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ fontFamily: "'Noto Serif', serif", fontWeight: 700,
            fontSize: '17px', color: COLORS.text, margin: 0 }}>
            월별 제출 추이
          </h4>
          <p style={{ fontSize: '13px', color: COLORS.textSub, marginTop: '4px', fontWeight: 500 }}>
            2026년 1월 — 6월 · 단위: 건수(%)
          </p>
        </div>
        <span className="material-symbols-outlined"
          style={{ color: COLORS.textSub, cursor: 'pointer', fontSize: '22px' }}>
          more_vert
        </span>
      </div>

      {/* 차트 영역 */}
      <div style={{ padding: '24px 28px 20px' }}>
        <div style={{ position: 'relative', height: '220px' }}>

          {/* Y축 눈금 선 */}
          {yTicks.map(tick => (
            <div key={tick} style={{
              position: 'absolute', left: 0, right: 0,
              bottom: `${tick}%`, display: 'flex', alignItems: 'center', gap: '10px',
              transform: 'translateY(50%)', pointerEvents: 'none',
            }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: COLORS.textSub,
                width: '28px', textAlign: 'right', flexShrink: 0 }}>
                {tick}
              </span>
              <div style={{ flex: 1, borderTop: tick === 0
                ? '2px solid #c3c6d5'
                : '1px dashed #dde3f0' }} />
            </div>
          ))}

          {/* 막대들 */}
          <div style={{
            position: 'absolute', inset: 0, paddingLeft: '44px',
            display: 'flex', alignItems: 'flex-end', gap: '12px',
          }}>
            {barData.map((b) => {
              const isMax = b.pct === maxPct
              const opacity = 0.4 + (b.pct / 100) * 0.6
              return (
                <div key={b.month} style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end',
                }}>
                  {/* 수치 레이블 — 항상 노출 */}
                  <span style={{
                    fontSize: '13px', fontWeight: 700,
                    color: isMax ? COLORS.primary : COLORS.textSub,
                    lineHeight: 1,
                  }}>
                    {b.pct}%
                  </span>

                  {/* 막대 */}
                  <div
                    title={`${b.month}: ${b.pct}%`}
                    style={{
                      width: '100%', minHeight: '6px', borderRadius: '6px 6px 0 0',
                      height: `${b.pct}%`,
                      background: isMax
                        ? `linear-gradient(to top, ${COLORS.primary}, #3b76e8)`
                        : `rgba(9,76,178,${opacity})`,
                      transition: 'all 0.6s ease',
                    }}
                  />

                  {/* 월 레이블 */}
                  <span style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textSub }}>
                    {b.month}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── 도넛 차트 ─── */
function DonutChart() {
  const R = 46
  const C = 2 * Math.PI * R
  // 각 세그먼트: strokeDasharray = [해당 길이, 전체 둘레]
  // offset 누적으로 위치 조정
  let offset = 0
  const segments = donutLegend.map((item) => {
    const len = (item.pct / 100) * C
    const seg = { ...item, len, offset }
    offset += len
    return seg
  })

  return (
    <div style={{
      background: '#ffffff', border: '1px solid #dde3f0', borderRadius: '16px',
      boxShadow: '0 2px 8px rgba(9,76,178,0.07)', overflow: 'hidden',
    }}>
      {/* 헤더 */}
      <div style={{ padding: '20px 28px', borderBottom: '1px solid #dde3f0' }}>
        <h4 style={{ fontFamily: "'Noto Serif', serif", fontWeight: 700,
          fontSize: '17px', color: COLORS.text, margin: 0 }}>
          안전 관리 준수율
        </h4>
        <p style={{ fontSize: '13px', color: COLORS.textSub, marginTop: '4px', fontWeight: 500 }}>
          전체 사업장 기준
        </p>
      </div>

      <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' }}>

        {/* SVG 도넛 */}
        <div style={{ position: 'relative', width: '172px', height: '172px' }}>
          <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            {/* 배경 트랙 */}
            <circle cx="60" cy="60" r={R} fill="none" stroke="#e7eeff" strokeWidth="12" />
            {/* 세그먼트 */}
            {segments.map((seg) => (
              <circle
                key={seg.label}
                cx="60" cy="60" r={R} fill="none"
                stroke={seg.color}
                strokeWidth="12"
                strokeDasharray={`${seg.len} ${C}`}
                strokeDashoffset={-seg.offset}
                strokeLinecap="butt"
              />
            ))}
          </svg>

          {/* 중앙 텍스트 */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: "'Noto Serif', serif", fontWeight: 800,
              fontSize: '1.7rem', color: COLORS.text, lineHeight: 1,
            }}>
              94.2%
            </span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#15803d', marginTop: '4px' }}>
              최적 상태
            </span>
          </div>
        </div>

        {/* 범례 */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {donutLegend.map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '12px', height: '12px', borderRadius: '50%',
                  background: item.color, flexShrink: 0,
                }} />
                <span style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textSub }}>
                  {item.label}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  background: item.bg, borderRadius: '6px',
                  padding: '2px 8px',
                }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: item.color }}>
                    {item.pct}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

/* ─── 메인 대시보드 ─── */
export default function Dashboard() {
  return (
    <section style={{ padding: '40px 40px', maxWidth: '1440px', margin: '0 auto' }}>

      {/* ── 페이지 헤더 ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        gap: '24px', flexWrap: 'wrap', marginBottom: '44px' }}>
        <div>
          <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: COLORS.primary, marginBottom: '8px' }}>
            실시간 모니터링
          </p>
          <h3 style={{ fontFamily: "'Noto Serif', serif", fontWeight: 800,
            fontSize: '2rem', color: COLORS.text, lineHeight: 1.2, margin: '0 0 10px' }}>
            운영자 대시보드
          </h3>
          <p style={{ fontSize: '15px', color: COLORS.textSub, lineHeight: 1.7,
            maxWidth: '480px', fontWeight: 500, margin: 0 }}>
            전체 사업장의 실시간 안전 및 환경 준수 상태를 모니터링합니다.
          </p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '12px 24px', background: COLORS.primary, color: '#fff',
          fontSize: '14px', fontWeight: 700, borderRadius: '12px', border: 'none',
          cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(9,76,178,0.3)',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#0a3d94'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(9,76,178,0.4)' }}
          onMouseLeave={e => { e.currentTarget.style.background = COLORS.primary; e.currentTarget.style.boxShadow = '0 4px 12px rgba(9,76,178,0.3)' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>send</span>
          미제출 대상 리마인더 발송
        </button>
      </div>

      {/* ── KPI 카드 그리드 ── */}
      <div style={{ marginBottom: '44px' }}>
        <SectionLabel>주요 지표</SectionLabel>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
        }}>
          {stats.map((s) => <KpiCard key={s.label} s={s} />)}
        </div>
      </div>

      {/* ── 차트 ── */}
      <div style={{ marginBottom: '44px' }}>
        <SectionLabel>현황 분석</SectionLabel>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
        }}>
          <div style={{ gridColumn: 'span 2' }}>
            <BarChart />
          </div>
          <DonutChart />
        </div>
      </div>

      {/* ── 최근 제출 현황 ── */}
      <div>
        <SectionLabel>최근 제출 현황</SectionLabel>
        <div style={{
          background: '#ffffff', border: '1px solid #dde3f0', borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(9,76,178,0.07)', overflow: 'hidden',
        }}>
          {/* 테이블 헤더 */}
          <div style={{ padding: '20px 28px', borderBottom: '1px solid #dde3f0',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontFamily: "'Noto Serif', serif", fontWeight: 700,
                fontSize: '17px', color: COLORS.text, margin: 0 }}>
                최근 제출 현황
              </h4>
              <p style={{ fontSize: '13px', color: COLORS.textSub, marginTop: '4px', fontWeight: 500 }}>
                최근 4건 기준
              </p>
            </div>
            <button style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '14px', fontWeight: 700, color: COLORS.primary,
              background: 'none', border: 'none', cursor: 'pointer',
            }}>
              전체 보기
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
            </button>
          </div>

          {/* 오버플로 스크롤 (모바일 대응) */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '540px' }}>
              <thead>
                <tr style={{ background: '#f8faff', borderBottom: '1px solid #dde3f0' }}>
                  {['회사', '담당자', '제출일', '상태'].map(col => (
                    <th key={col} style={{
                      padding: '14px 24px', textAlign: 'left',
                      fontSize: '12px', fontWeight: 700, color: COLORS.textSub,
                      letterSpacing: '0.07em', textTransform: 'uppercase',
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentRows.map((row, i) => (
                  <tr key={row.co} style={{
                    borderBottom: i < recentRows.length - 1 ? '1px solid #f0f2fa' : 'none',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f5f7ff'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '18px 24px', fontWeight: 700, fontSize: '15px',
                      color: COLORS.text, maxWidth: '200px' }}>
                      <span style={{ display: 'block', overflow: 'hidden',
                        textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {row.co}
                      </span>
                    </td>
                    <td style={{ padding: '18px 24px', fontSize: '15px', color: COLORS.text, fontWeight: 500 }}>
                      {row.name}
                    </td>
                    <td style={{ padding: '18px 24px', fontSize: '14px', color: COLORS.textSub,
                      fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>
                      {row.date}
                    </td>
                    <td style={{ padding: '18px 24px' }}>
                      <span style={{
                        background: row.statusBg, color: row.statusColor,
                        padding: '5px 12px', borderRadius: '999px',
                        fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap',
                      }}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </section>
  )
}
