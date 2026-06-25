import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import PageHeader from './ui/PageHeader'
import EmptyState from './ui/EmptyState'
import Card, { CardHeader, Badge, Btn } from './ui/Card'

/* ──────────────────────────────────────────────────────
   가상 데이터 없음 — 실 데이터는 엑셀 가져오기로 주입
   ────────────────────────────────────────────────────── */

const STATUS_CONFIG = {
  승인: { bg: '#dcfce7', color: '#15803d', badgeColor: 'green' },
  대기: { bg: '#fef9c3', color: '#854d0e', badgeColor: 'yellow' },
  반려: { bg: '#ffe4e6', color: '#be123c', badgeColor: 'red' },
}

/* ── 필터 셀렉트 ── */
function FilterSelect({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={onChange} style={{
      border: '1.5px solid #c3c6d5', borderRadius: '10px',
      height: '40px', fontSize: '13px', fontWeight: 600,
      color: '#3d4356', padding: '0 14px', background: '#fff',
      cursor: 'pointer', outline: 'none',
    }}>
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

/* ── 테이블 헤더 셀 ── */
const TH = ({ children, width }) => (
  <th style={{
    padding: '13px 20px', fontSize: '11px', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.07em',
    color: '#3d4356', background: '#f8faff',
    borderBottom: '1px solid #e8ecf8', whiteSpace: 'nowrap',
    width, textAlign: 'left',
  }}>
    {children}
  </th>
)

/* ── 테이블 데이터 셀 ── */
const TD = ({ children, mono }) => (
  <td style={{
    padding: '15px 20px', fontSize: '14px', color: '#3d4356',
    fontFamily: mono ? "'JetBrains Mono', monospace" : 'inherit',
    verticalAlign: 'middle',
  }}>
    {children}
  </td>
)

/* ── 메인 컴포넌트 ── */
export default function Masterlist({ initialRows = [] }) {
  const [rows,          setRows]          = useState(initialRows)
  const [companyFilter, setCompanyFilter] = useState('')
  const [roleFilter,    setRoleFilter]    = useState('')
  const [selectAll,     setSelectAll]     = useState(false)
  const fileInputRef = useRef(null)

  /* 파생 데이터 */
  const companies = [...new Set(rows.map(r => r.company).filter(Boolean))]
  const roles     = [...new Set(rows.map(r => r.role).filter(Boolean))]

  const filtered = rows.filter(r => {
    if (companyFilter && r.company !== companyFilter) return false
    if (roleFilter    && r.role    !== roleFilter)    return false
    return true
  })

  const selectedIds   = rows.filter(r => r.checked).map(r => r.id)
  const selectedCount = selectedIds.length

  /* 핸들러 */
  const toggleAll = (checked) => {
    setSelectAll(checked)
    setRows(prev => prev.map(r => ({ ...r, checked })))
  }
  const toggleRow = (id) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, checked: !r.checked } : r))
    setSelectAll(false)
  }
  const handleApprove = () => {
    setRows(prev => prev.map(r => selectedIds.includes(r.id) ? { ...r, status: '승인', checked: false } : r))
    setSelectAll(false)
  }
  const handleExport = () => {
    if (filtered.length === 0) return
    const ws = XLSX.utils.json_to_sheet(filtered.map(r => ({
      회사: r.company, 성명: r.name, 사번: r.empId,
      부서: r.dept, 역할: r.role, 이메일: r.email, 상태: r.status,
    })))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '마스터명단')
    XLSX.writeFile(wb, '마스터_명단.xlsx')
  }
  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: 'array' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const data = XLSX.utils.sheet_to_json(ws, { defval: '' })
      const imported = data.map((row, i) => ({
        id:      Date.now() + i,
        company: row['회사']  || '',
        name:    row['성명']  || '',
        empId:   row['사번']  || '',
        dept:    row['부서']  || '',
        role:    row['역할']  || '',
        email:   row['이메일'] || '',
        status:  row['상태']  || '대기',
        checked: false,
      }))
      setRows(prev => [...prev, ...imported])
    }
    reader.readAsArrayBuffer(file)
    e.target.value = ''
  }
  const handleResetFilters = () => { setCompanyFilter(''); setRoleFilter('') }

  return (
    <div style={{ padding: '40px', maxWidth: '1440px', margin: '0 auto' }}>

      <PageHeader
        title="마스터 명단"
        subtitle="전체 등록 담당자를 조회하고 승인 상태를 관리합니다."
        badge={rows.length > 0 ? `총 ${rows.length}명` : undefined}
        actions={
          <>
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv"
              style={{ display: 'none' }} onChange={handleImport} />
            <Btn variant="ghost" icon="upload" onClick={() => fileInputRef.current?.click()}>
              엑셀 가져오기
            </Btn>
            <Btn variant="secondary" icon="download" onClick={handleExport} disabled={filtered.length === 0}>
              엑셀 내보내기
            </Btn>
            <Btn variant="primary" icon="check_circle" onClick={handleApprove} disabled={selectedCount === 0}>
              선택 승인 {selectedCount > 0 && `(${selectedCount})`}
            </Btn>
          </>
        }
      />

      {/* 필터 바 */}
      {rows.length > 0 && (
        <Card padding="16px 20px" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#3d4356', whiteSpace: 'nowrap' }}>
              필터
            </span>
            <FilterSelect value={companyFilter} onChange={e => setCompanyFilter(e.target.value)}
              options={companies} placeholder="전체 회사" />
            <FilterSelect value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
              options={roles} placeholder="전체 역할" />
            {(companyFilter || roleFilter) && (
              <button onClick={handleResetFilters} style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '8px 14px', background: '#f1f5f9', border: 'none',
                borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                color: '#3d4356', cursor: 'pointer',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
                초기화
              </button>
            )}
            <span style={{ marginLeft: 'auto', fontSize: '13px', color: '#737784', fontWeight: 600 }}>
              {filtered.length}개 결과
            </span>
          </div>
        </Card>
      )}

      {/* 테이블 카드 */}
      <Card>
        <CardHeader
          title="관리자 디렉토리"
          subtitle={rows.length === 0
            ? '엑셀 가져오기로 데이터를 추가하세요'
            : `${filtered.length}명 표시 중`}
        />

        {rows.length === 0 ? (
          <EmptyState
            icon="table_view"
            title="등록된 데이터가 없습니다"
            description="우측 상단의 '엑셀 가져오기' 버튼으로 마스터 명단을 업로드하거나, 담당자 관리 페이지에서 직접 등록할 수 있습니다."
            action={
              <Btn variant="primary" icon="upload" onClick={() => fileInputRef.current?.click()}>
                엑셀 가져오기
              </Btn>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="filter_list_off"
            title="필터 결과가 없습니다"
            description="선택한 조건에 해당하는 데이터가 없습니다. 필터를 초기화해 주세요."
            action={
              <Btn variant="ghost" icon="close" onClick={handleResetFilters}>필터 초기화</Btn>
            }
          />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '680px' }}>
              <thead>
                <tr>
                  <TH width="44px">
                    <input type="checkbox" checked={selectAll}
                      onChange={e => toggleAll(e.target.checked)}
                      style={{ cursor: 'pointer', width: '15px', height: '15px' }} />
                  </TH>
                  <TH>회사</TH>
                  <TH>성명</TH>
                  <TH>부서</TH>
                  <TH>역할</TH>
                  <TH>이메일</TH>
                  <TH>상태</TH>
                  <TH width="60px"> </TH>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => {
                  const sc = STATUS_CONFIG[row.status] ?? { bg: '#f1f5f9', color: '#3d4356' }
                  return (
                    <tr key={row.id} style={{
                      borderBottom: i < filtered.length - 1 ? '1px solid #f0f2fa' : 'none',
                      background: row.checked ? '#f0f6ff' : 'transparent',
                      transition: 'background 0.15s',
                    }}
                      onMouseEnter={e => { if (!row.checked) e.currentTarget.style.background = '#f8faff' }}
                      onMouseLeave={e => { if (!row.checked) e.currentTarget.style.background = 'transparent' }}
                    >
                      <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>
                        <input type="checkbox" checked={row.checked}
                          onChange={() => toggleRow(row.id)}
                          style={{ cursor: 'pointer', width: '15px', height: '15px' }} />
                      </td>
                      <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#111c2d' }}>
                          {row.company || '—'}
                        </span>
                      </td>
                      <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#111c2d', margin: 0 }}>
                          {row.name || '—'}
                        </p>
                        {row.empId && (
                          <p style={{ fontSize: '11px', color: '#737784', margin: '2px 0 0',
                            fontFamily: "'JetBrains Mono', monospace" }}>
                            ID: {row.empId}
                          </p>
                        )}
                      </td>
                      <TD>{row.dept || '—'}</TD>
                      <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>
                        <Badge color="blue">{row.role || '—'}</Badge>
                      </td>
                      <TD mono>{row.email || '—'}</TD>
                      <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>
                        <span style={{
                          background: sc.bg, color: sc.color,
                          fontSize: '12px', fontWeight: 700,
                          padding: '4px 12px', borderRadius: '999px', whiteSpace: 'nowrap',
                        }}>
                          {row.status}
                        </span>
                      </td>
                      <td style={{ padding: '15px 20px', verticalAlign: 'middle', textAlign: 'right' }}>
                        <button style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: '#094cb2', padding: '6px', borderRadius: '8px',
                          display: 'inline-flex', transition: 'background 0.15s',
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = '#dbeafe'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

    </div>
  )
}
