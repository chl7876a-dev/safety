import EmptyState from './ui/EmptyState'
import Card, { CardHeader } from './ui/Card'
import PageHeader from './ui/PageHeader'

/* ── 색상 팔레트 (WCAG AA ✓) ── */
const C = {
  primary: '#094cb2',
  teal:    '#0f766e',
  amber:   '#b45309',
  rose:    '#be123c',
  text:    '#111c2d',
  sub:     '#3d4356',
}

/* ── KPI 카드 틀 ── */
const KPI_DEFS = [
  { label: '전체 대상 회사', unit: '개',  icon: 'business',        iconBg: '#dbeafe', iconColor: C.primary, accentColor: C.primary },
  { label: '제출 완료',     unit: '건',  icon: 'task_alt',         iconBg: '#ccfbf1', iconColor: C.teal,    accentColor: C.teal   },
  { label: '검수 대기',     unit: '건',  icon: 'pending_actions',  iconBg: '#fef3c7', iconColor: C.amber,   accentColor: C.amber  },
  { label: '최종 확정',     unit: '명',  icon: 'verified',         iconBg: '#ffe4e6', iconColor: C.rose,    accentColor: C.rose   },
]

/* ── KPI 카드 (값이 null이면 —/—) ── */
function KpiCard({ def, value, sub }) {
  const hasData = value !== null && value !== undefined

  return (
    <div style={{
      background: '#fff', border: '1px solid #dde3f0',
      borderTop: `4px solid ${def.accentColor}`,
      borderRadius: '16px', padding: '28px',
      boxShadow: '0 2px 8px rgba(9,76,178,0.07)',
      transition: 'box-shadow 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(9,76,178,0.13)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(9,76,178,0.07)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: C.sub, lineHeight: 1.4, maxWidth: '68%' }}>
          {def.label}
        </span>
        <div style={{
          padding: '10px', borderRadius: '12px', background: def.iconBg,
          display: 'flex', alignItems: 'center', flexShrink: 0,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '22px', color: def.iconColor }}>
            {def.icon}
          </span>
        </div>
      </div>

      {hasData ? (
        <>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '10px' }}>
            <span style={{ fontSize: '2.75rem', fontWeight: 800, color: C.text,
              fontFamily: "'Noto Serif', serif", lineHeight: 1 }}>
              {value}
            </span>
            <span style={{ fontSize: '15px', fontWeight: 600, color: C.sub }}>{def.unit}</span>
          </div>
          {sub && (
            <p style={{ fontSize: '13px', fontWeight: 600, color: C.sub, margin: 0, lineHeight: 1.4 }}>{sub}</p>
          )}
        </>
      ) : (
        <div>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#c3c6d5', margin: '0 0 8px',
            fontFamily: "'Noto Serif', serif" }}>
            —
          </p>
          <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>데이터 없음</p>
        </div>
      )}
    </div>
  )
}

/* ── 빈 차트 플레이스홀더 ── */
function ChartPlaceholder({ title, subtitle, icon = 'bar_chart' }) {
  return (
    <Card>
      <CardHeader title={title} subtitle={subtitle} />
      <EmptyState
        icon={icon}
        title="데이터가 없습니다"
        description="담당자 등록 및 제출 데이터가 쌓이면 차트가 자동으로 표시됩니다."
      />
    </Card>
  )
}

/* ── 최근 제출 테이블 ── */
function RecentTable({ rows }) {
  if (!rows || rows.length === 0) {
    return (
      <Card>
        <CardHeader title="최근 제출 현황" subtitle="최근 제출 이력" />
        <EmptyState
          icon="receipt_long"
          title="제출 이력이 없습니다"
          description="담당자가 서류를 제출하면 이곳에 현황이 표시됩니다."
        />
      </Card>
    )
  }

  const STATUS_STYLE = {
    '검수 완료': { bg: '#dcfce7', color: '#15803d' },
    '검수 중':   { bg: '#fef9c3', color: '#854d0e' },
    '미제출':    { bg: '#ffe4e6', color: '#be123c' },
  }

  return (
    <Card>
      <CardHeader
        title="최근 제출 현황"
        subtitle={`${rows.length}건`}
        right={
          <button style={{ fontSize: '13px', fontWeight: 700, color: C.primary,
            background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            전체 보기
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
          </button>
        }
      />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '480px' }}>
          <thead>
            <tr style={{ background: '#f8faff', borderBottom: '1px solid #e8ecf8' }}>
              {['회사', '담당자', '제출일', '상태'].map(col => (
                <th key={col} style={{ padding: '13px 24px', textAlign: 'left',
                  fontSize: '11px', fontWeight: 700, color: C.sub,
                  letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const st = STATUS_STYLE[row.status] ?? { bg: '#f1f5f9', color: '#3d4356' }
              return (
                <tr key={i} style={{ borderBottom: i < rows.length - 1 ? '1px solid #f0f2fa' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f5f7ff'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '17px 24px', fontSize: '14px', fontWeight: 700, color: C.text }}>{row.company}</td>
                  <td style={{ padding: '17px 24px', fontSize: '14px', color: C.text }}>{row.name}</td>
                  <td style={{ padding: '17px 24px', fontSize: '13px', color: C.sub,
                    fontFamily: "'JetBrains Mono', monospace" }}>{row.date}</td>
                  <td style={{ padding: '17px 24px' }}>
                    <span style={{ background: st.bg, color: st.color,
                      fontSize: '12px', fontWeight: 700, padding: '4px 12px',
                      borderRadius: '999px', whiteSpace: 'nowrap' }}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

/* ════════════════════════════════════════
   메인 대시보드
   props:
     stats?       = { totalCompanies, submitted, pending, confirmed }
     barData?     = [{ month, pct }]
     donutPct?    = number (0~100)
     recentRows?  = [{ company, name, date, status }]
   ════════════════════════════════════════ */
export default function Dashboard({
  stats:     statData   = null,
  barData:   barData    = null,
  donutPct:  donutPct   = null,
  recentRows: recentRows = null,
}) {
  const kpiValues = [
    { value: statData?.totalCompanies ?? null, sub: statData?.totalCompaniesSub ?? null },
    { value: statData?.submitted      ?? null, sub: statData?.submittedSub      ?? null },
    { value: statData?.pending        ?? null, sub: statData?.pendingSub        ?? null },
    { value: statData?.confirmed      ?? null, sub: statData?.confirmedSub      ?? null },
  ]

  const hasBarData   = Array.isArray(barData)   && barData.length   > 0
  const hasDonut     = donutPct !== null
  const hasRecent    = Array.isArray(recentRows) && recentRows.length > 0

  return (
    <div style={{ padding: '40px', maxWidth: '1440px', margin: '0 auto' }}>

      {/* 페이지 헤더 */}
      <PageHeader
        title="운영자 대시보드"
        subtitle="전체 사업장의 실시간 안전 및 환경 준수 상태를 모니터링합니다."
        actions={
          <button style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', background: C.primary, color: '#fff',
            fontSize: '14px', fontWeight: 700, borderRadius: '12px',
            border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(9,76,178,0.3)', transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#0a3d94'}
            onMouseLeave={e => e.currentTarget.style.background = C.primary}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>send</span>
            미제출 대상 리마인더 발송
          </button>
        }
      />

      {/* 데이터 전혀 없을 때 전체 빈 상태 */}
      {!statData && !hasBarData && !hasDonut && !hasRecent ? (
        <Card>
          <EmptyState
            icon="monitoring"
            title="아직 연동된 데이터가 없습니다"
            description="담당자를 등록하고 제출 데이터가 쌓이면 대시보드 지표가 자동으로 채워집니다."
            action={
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button style={{
                  padding: '10px 24px', background: C.primary, color: '#fff',
                  border: 'none', borderRadius: '10px', fontSize: '14px',
                  fontWeight: 700, cursor: 'pointer',
                }}>
                  담당자 등록하기
                </button>
              </div>
            }
          />
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* KPI 카드 */}
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: C.sub, marginBottom: '14px' }}>
              주요 지표
            </p>
            <div style={{ display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              {KPI_DEFS.map((def, i) => (
                <KpiCard key={def.label} def={def}
                  value={kpiValues[i].value} sub={kpiValues[i].sub} />
              ))}
            </div>
          </div>

          {/* 차트 영역 */}
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: C.sub, marginBottom: '14px' }}>
              현황 분석
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
              {hasBarData
                ? <BarChart data={barData} />
                : <ChartPlaceholder title="월별 제출 추이" subtitle="월별 제출 건수 추이" icon="bar_chart" />
              }
              {hasDonut
                ? <DonutChart pct={donutPct} />
                : <ChartPlaceholder title="안전 관리 준수율" subtitle="전체 사업장 기준" icon="donut_large" />
              }
            </div>
          </div>

          {/* 최근 제출 */}
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: C.sub, marginBottom: '14px' }}>
              최근 제출 현황
            </p>
            <RecentTable rows={recentRows} />
          </div>

        </div>
      )}
    </div>
  )
}

/* ── 실 데이터가 있을 때만 렌더되는 바 차트 ── */
function BarChart({ data }) {
  const maxPct = Math.max(...data.map(b => b.pct))
  return (
    <Card>
      <CardHeader title="월별 제출 추이" subtitle="단위: 건수(%)" />
      <div style={{ padding: '24px 28px 20px' }}>
        <div style={{ position: 'relative', height: '200px' }}>
          {[0, 25, 50, 75, 100].map(tick => (
            <div key={tick} style={{ position: 'absolute', left: 0, right: 0,
              bottom: `${tick}%`, display: 'flex', alignItems: 'center', gap: '10px',
              transform: 'translateY(50%)', pointerEvents: 'none' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: C.sub, width: '24px', textAlign: 'right', flexShrink: 0 }}>{tick}</span>
              <div style={{ flex: 1, borderTop: tick === 0 ? '2px solid #c3c6d5' : '1px dashed #e8ecf8' }} />
            </div>
          ))}
          <div style={{ position: 'absolute', inset: 0, paddingLeft: '40px',
            display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
            {data.map(b => (
              <div key={b.month} style={{ flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '12px', fontWeight: 700,
                  color: b.pct === maxPct ? C.primary : C.sub }}>{b.pct}%</span>
                <div style={{
                  width: '100%', minHeight: '4px', borderRadius: '6px 6px 0 0',
                  height: `${b.pct}%`,
                  background: b.pct === maxPct
                    ? `linear-gradient(to top, ${C.primary}, #3b76e8)`
                    : `rgba(9,76,178,${0.3 + (b.pct / 100) * 0.5})`,
                }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: C.sub }}>{b.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

/* ── 실 데이터가 있을 때만 렌더되는 도넛 차트 ── */
function DonutChart({ pct }) {
  const R = 46, circumference = 2 * Math.PI * R
  return (
    <Card>
      <CardHeader title="안전 관리 준수율" subtitle="전체 사업장 기준" />
      <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        <div style={{ position: 'relative', width: '160px', height: '160px' }}>
          <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <circle cx="60" cy="60" r={R} fill="none" stroke="#e7eeff" strokeWidth="12" />
            <circle cx="60" cy="60" r={R} fill="none" stroke={C.primary} strokeWidth="12"
              strokeDasharray={`${circumference * (pct / 100)} ${circumference}`}
              strokeLinecap="round" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Noto Serif', serif", fontWeight: 800,
              fontSize: '1.6rem', color: C.text, lineHeight: 1 }}>{pct}%</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#15803d', marginTop: '4px' }}>준수 중</span>
          </div>
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { label: '준수 완료', color: C.primary, bg: '#dbeafe', value: `${pct}%` },
            { label: '미준수',   color: C.rose,    bg: '#ffe4e6', value: `${(100 - pct).toFixed(1)}%` },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: C.sub }}>{item.label}</span>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: item.color,
                background: item.bg, padding: '2px 8px', borderRadius: '6px' }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
