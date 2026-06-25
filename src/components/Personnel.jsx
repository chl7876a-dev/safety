import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import PageHeader from './ui/PageHeader'
import EmptyState from './ui/EmptyState'
import Card, { CardHeader, Badge, Btn } from './ui/Card'
import InfoBanner from './ui/InfoBanner'

/* ── 상수 ── */
const DEPARTMENTS = ['운영팀', '안전팀', '환경팀', '총무팀', '기술팀', '품질팀']
const ROLES = ['안전 관리자', '환경 관리자', '현장 감독', '안전보건관리자', '위험물관리자', '소방안전관리자']

/* ── 엑셀 업로드 영역 ── */
function ExcelUploadZone({ onDataLoaded }) {
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName]   = useState(null)
  const [error, setError]         = useState(null)
  const inputRef = useRef(null)

  const processFile = (file) => {
    setError(null)
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['xlsx', 'xls', 'csv'].includes(ext)) {
      setError('xlsx, xls, csv 파일만 지원합니다.')
      return
    }
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        // header:1 → 첫 번째 행을 헤더로 쓰지 않고 2D 배열로 먼저 가져와 헤더 키를 직접 확인
        const raw = XLSX.utils.sheet_to_json(ws, { defval: '', raw: false })

        // ① 파싱 직후 — 실제 키가 무엇인지 콘솔로 확인
        console.log('[Excel] 파싱된 행 수:', raw.length)
        if (raw.length > 0) {
          console.log('[Excel] 첫 번째 행 키:', Object.keys(raw[0]))
          console.log('[Excel] 첫 번째 행 값:', raw[0])
        }

        if (raw.length === 0) {
          setError('파일에 데이터가 없습니다. 첫 번째 행에 헤더가 있어야 합니다.')
          return
        }
        onDataLoaded(raw, file.name)
      } catch (err) {
        console.error('[Excel] 파싱 오류:', err)
        setError('파일을 읽는 중 오류가 발생했습니다.')
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const zoneStyle = {
    border: `2px dashed ${dragging ? '#094cb2' : '#c3c6d5'}`,
    background: dragging ? '#f0f6ff' : '#fafbff',
    borderRadius: '14px', padding: '40px 24px',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', textAlign: 'center', gap: '16px',
    cursor: 'pointer', transition: 'all 0.2s', minHeight: '220px',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 드래그 존 */}
      <div
        style={zoneStyle}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]) }}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }}
          onChange={(e) => processFile(e.target.files[0])} />

        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#dbeafe',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#094cb2' }}>
            upload_file
          </span>
        </div>

        {fileName ? (
          <>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#094cb2', margin: 0 }}>{fileName}</p>
            <p style={{ fontSize: '13px', color: '#737784', margin: 0 }}>파일이 로드되었습니다. 다른 파일을 선택하려면 클릭하세요.</p>
          </>
        ) : (
          <>
            <p style={{ fontSize: '15px', fontWeight: 700, color: '#111c2d', margin: 0 }}>엑셀 파일 업로드</p>
            <p style={{ fontSize: '13px', color: '#737784', margin: 0, lineHeight: 1.6 }}>
              .xlsx, .xls, .csv 파일을<br />끌어다 놓거나 클릭하여 선택하세요
            </p>
          </>
        )}

        <Btn
          variant="primary"
          icon="folder_open"
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
        >
          파일 선택
        </Btn>
        {error && <p style={{ fontSize: '13px', color: '#be123c', margin: 0 }}>{error}</p>}
      </div>

      {/* 템플릿 다운로드 */}
      <Card padding="16px 20px">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f0f3ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#47617b' }}>description</span>
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#111c2d', margin: 0 }}>엑셀 템플릿 다운로드</p>
              <p style={{ fontSize: '12px', color: '#737784', margin: '2px 0 0' }}>성명, 부서, 직무, 이메일, 연락처, 사업장 포함</p>
            </div>
          </div>
          <Btn variant="secondary" icon="download"
            onClick={() => {
              const ws = XLSX.utils.aoa_to_sheet([['성명', '부서', '직무', '이메일', '연락처', '사업장']])
              const wb = XLSX.utils.book_new()
              XLSX.utils.book_append_sheet(wb, ws, '담당자목록')
              XLSX.writeFile(wb, '담당자_등록_템플릿.xlsx')
            }}>
            다운로드
          </Btn>
        </div>
      </Card>

      {/* 안내 */}
      <InfoBanner type="info">
        <strong>업로드 형식 안내</strong><br />
        첫 번째 행은 열 제목(헤더)이어야 합니다.<br />
        <strong>필수 열:</strong> 성명, 부서, 직무, 이메일<br />
        <strong>선택 열:</strong> 연락처, 사업장, 입사일, 자격증번호
      </InfoBanner>
    </div>
  )
}

/* ── 직접 입력 폼 ── */
function DirectInputForm({ onAdd }) {
  const empty = { name: '', department: '', role: '', email: '', phone: '', site: '' }
  const [form, setForm]     = useState(empty)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim())  e.name = '성명을 입력하세요.'
    if (!form.department)   e.department = '부서를 선택하세요.'
    if (!form.role)         e.role = '직무를 선택하세요.'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = '올바른 이메일을 입력하세요.'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onAdd({ ...form, id: Date.now() })
    setForm(empty); setErrors({}); setSuccess(true)
    setTimeout(() => setSuccess(false), 2500)
  }

  const inputStyle = (key) => ({
    width: '100%', padding: '10px 14px', borderRadius: '10px',
    border: `1.5px solid ${errors[key] ? '#be123c' : '#c3c6d5'}`,
    fontSize: '14px', color: '#111c2d', background: '#fff',
    outline: 'none', transition: 'border-color 0.15s', boxSizing: 'border-box',
  })

  const labelStyle = { fontSize: '13px', fontWeight: 700, color: '#3d4356',
    display: 'block', marginBottom: '6px' }

  const Field = ({ fkey, label, type = 'text', placeholder = '' }) => (
    <div>
      <label style={labelStyle}>
        {label} {['name','department','role','email'].includes(fkey) && <span style={{ color: '#be123c' }}>*</span>}
      </label>
      <input type={type} value={form[fkey]} placeholder={placeholder}
        style={inputStyle(fkey)}
        onChange={(e) => setForm(p => ({ ...p, [fkey]: e.target.value }))}
        onFocus={(e) => { e.target.style.borderColor = '#094cb2' }}
        onBlur={(e) => { e.target.style.borderColor = errors[fkey] ? '#be123c' : '#c3c6d5' }}
      />
      {errors[fkey] && <p style={{ fontSize: '12px', color: '#be123c', marginTop: '4px' }}>{errors[fkey]}</p>}
    </div>
  )

  const Select = ({ fkey, label, options }) => (
    <div>
      <label style={labelStyle}>
        {label} <span style={{ color: '#be123c' }}>*</span>
      </label>
      <select value={form[fkey]}
        style={inputStyle(fkey)}
        onChange={(e) => setForm(p => ({ ...p, [fkey]: e.target.value }))}
      >
        <option value="">선택하세요</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {errors[fkey] && <p style={{ fontSize: '12px', color: '#be123c', marginTop: '4px' }}>{errors[fkey]}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit}>
      {success && (
        <div style={{ marginBottom: '16px' }}>
          <InfoBanner type="success">목록에 추가되었습니다.</InfoBanner>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <Field fkey="name"       label="성명"   placeholder="홍길동" />
        <Select fkey="department" label="부서"   options={DEPARTMENTS} />
        <Select fkey="role"       label="직무"   options={ROLES} />
        <Field fkey="email"      label="이메일" type="email" placeholder="email@company.com" />
        <Field fkey="phone"      label="연락처" type="tel"  placeholder="010-0000-0000" />
        <Field fkey="site"       label="사업장" placeholder="서울 본사" />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Btn variant="primary" icon="person_add">목록에 추가</Btn>
      </div>
    </form>
  )
}

/* ── 등록 목록 테이블 ── */
function PersonnelTable({ rows, rawHeaders }) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon="group_add"
        title="등록된 담당자가 없습니다"
        description="왼쪽에서 엑셀 파일을 업로드하거나 직접 입력하면 이곳에 목록이 표시됩니다."
      />
    )
  }

  const thStyle = {
    padding: '13px 20px', fontSize: '11px', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.07em',
    color: '#3d4356', background: '#f8faff',
    borderBottom: '1px solid #e8ecf8', whiteSpace: 'nowrap',
  }
  const tdStyle = { padding: '14px 20px', fontSize: '14px', color: '#3d4356', verticalAlign: 'middle' }

  // 표준 필드가 모두 비어 있으면 원본 컬럼을 그대로 표시 (헤더 불일치 대응)
  const excelRows  = rows.filter(r => r.source === 'excel')
  const mappingOk  = excelRows.length === 0 ||
    excelRows.some(r => r.name || r.department || r.role || r.email)
  const showRaw    = !mappingOk && rawHeaders.length > 0

  return (
    <div>
      {/* 헤더 불일치 경고 */}
      {showRaw && (
        <div style={{ padding: '12px 20px', background: '#fffbeb', borderBottom: '1px solid #fde68a' }}>
          <p style={{ fontSize: '13px', color: '#854d0e', margin: 0, fontWeight: 600 }}>
            ⚠ 엑셀 헤더가 템플릿과 다릅니다. 인식된 컬럼: <strong>{rawHeaders.join(', ')}</strong>
            <br />템플릿을 다운로드해 헤더를 맞춰 주시거나, 아래 원본 데이터를 확인하세요.
          </p>
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        {showRaw ? (
          /* 원본 컬럼 그대로 표시 */
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '480px' }}>
            <thead>
              <tr>
                {rawHeaders.map(h => <th key={h} style={thStyle}>{h}</th>)}
                <th style={thStyle}>출처</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => (
                <tr key={p.id}
                  style={{ borderBottom: i < rows.length - 1 ? '1px solid #f0f2fa' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f5f7ff'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {rawHeaders.map(h => (
                    <td key={h} style={tdStyle}>{p._raw?.[h] ?? '—'}</td>
                  ))}
                  <td style={{ ...tdStyle, padding: '14px 20px' }}>
                    <Badge color={p.source === 'excel' ? 'green' : 'blue'}>
                      {p.source === 'excel' ? '엑셀' : '직접입력'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          /* 표준 매핑 컬럼 표시 */
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '520px' }}>
            <thead>
              <tr>
                {['성명', '부서', '직무', '이메일', '출처'].map(col => (
                  <th key={col} style={thStyle}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => (
                <tr key={p.id}
                  style={{ borderBottom: i < rows.length - 1 ? '1px solid #f0f2fa' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f5f7ff'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ ...tdStyle, fontWeight: 700, color: '#111c2d' }}>{p.name || '—'}</td>
                  <td style={tdStyle}>{p.department || '—'}</td>
                  <td style={tdStyle}>{p.role || '—'}</td>
                  <td style={{ ...tdStyle, fontSize: '13px', color: '#737784',
                    fontFamily: "'JetBrains Mono', monospace" }}>
                    {p.email || '—'}
                  </td>
                  <td style={{ ...tdStyle }}>
                    <Badge color={p.source === 'excel' ? 'green' : 'blue'}>
                      {p.source === 'excel' ? '엑셀' : '직접입력'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   키 정규화: BOM·공백·대소문자를 제거한 뒤 후보 목록과 비교
   ──────────────────────────────────────────────────────────── */
const norm = (s) => String(s ?? '').replace(/^﻿/, '').trim().toLowerCase().replace(/\s+/g, '')

const pick = (row, candidates) => {
  const rowKeys = Object.keys(row)
  for (const c of candidates) {
    // 정확히 일치
    if (row[c] !== undefined && row[c] !== '') return String(row[c])
    // 정규화 후 비교
    const matched = rowKeys.find(k => norm(k) === norm(c))
    if (matched && row[matched] !== undefined && row[matched] !== '') return String(row[matched])
  }
  return ''
}

/* ── 메인 컴포넌트 ── */
export default function Personnel() {
  const [uploadedData,   setUploadedData]   = useState([])
  const [manualList,     setManualList]     = useState([])
  const [tab,            setTab]            = useState('upload')
  const [rawHeaders,     setRawHeaders]     = useState([])   // 원본 헤더 보존

  const handleDataLoaded = (data) => {
    // ② 상태 업데이트 직전 확인
    console.log('[State] setUploadedData 호출, 행 수:', data.length)
    setUploadedData(data)
    setRawHeaders(data.length > 0 ? Object.keys(data[0]) : [])
  }
  const handleAddManual  = (person) => setManualList(prev => [...prev, person])

  // ③ 렌더 시 매핑 확인 — pick()이 유연하게 여러 키 후보를 시도
  const allPersonnel = [
    ...uploadedData.map((row, i) => {
      const mapped = {
        id:         `upload-${i}`,
        name:       pick(row, ['성명', '이름', 'name', 'Name', '담당자명']),
        department: pick(row, ['부서', '팀', 'department', 'dept', 'Department']),
        role:       pick(row, ['직무', '역할', '직책', 'role', 'Role', 'position']),
        email:      pick(row, ['이메일', 'email', 'e-mail', 'Email', 'E-mail', '메일']),
        phone:      pick(row, ['연락처', '전화', '휴대폰', 'phone', 'tel']),
        site:       pick(row, ['사업장', '근무지', '위치', 'site', 'location']),
        source:     'excel',
        _raw:       row,   // 원본 보존 (디버그 + 알 수 없는 컬럼 표시용)
      }
      // ③ 첫 번째 행만 매핑 결과 출력
      if (i === 0) console.log('[Mapping] 첫 번째 행 매핑 결과:', mapped)
      return mapped
    }),
    ...manualList.map(p => ({ ...p, source: 'manual' })),
  ]

  // ④ 렌더 시 최종 배열 길이 확인
  console.log('[Render] allPersonnel.length:', allPersonnel.length)

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(allPersonnel.map(p => ({
      성명: p.name, 부서: p.department, 직무: p.role, 이메일: p.email,
    })))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '담당자목록')
    XLSX.writeFile(wb, '등록_담당자_목록.xlsx')
  }

  const tabs = [
    { id: 'upload', label: '엑셀 업로드', icon: 'upload_file' },
    { id: 'manual', label: '직접 입력',   icon: 'edit_note' },
  ]

  return (
    <div style={{ padding: '40px', maxWidth: '1440px', margin: '0 auto' }}>

      <PageHeader
        title="담당자 정보 등록"
        subtitle="표준 템플릿을 사용한 엑셀 일괄 업로드 또는 개별 직접 입력이 가능합니다. 별표(*) 표시 항목은 필수입니다."
      />

      {/* 탭 */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '2px solid #e8ecf8', marginBottom: '28px' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 20px', fontSize: '14px', fontWeight: 700,
            background: 'none', border: 'none', cursor: 'pointer',
            borderBottom: `2px solid ${tab === t.id ? '#094cb2' : 'transparent'}`,
            color: tab === t.id ? '#094cb2' : '#737784',
            marginBottom: '-2px', transition: 'all 0.15s',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* 2단 레이아웃 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '24px', alignItems: 'start' }}>

        {/* 왼쪽: 입력 패널 */}
        <div>
          {tab === 'upload' ? (
            <ExcelUploadZone onDataLoaded={handleDataLoaded} />
          ) : (
            <Card padding="28px">
              <h4 style={{ fontFamily: "'Noto Serif', serif", fontWeight: 700,
                fontSize: '17px', color: '#111c2d', margin: '0 0 24px',
                paddingBottom: '16px', borderBottom: '1px solid #e8ecf8' }}>
                직접 입력
              </h4>
              <DirectInputForm onAdd={handleAddManual} />
            </Card>
          )}
        </div>

        {/* 오른쪽: 미리보기 */}
        <Card>
          <CardHeader
            title="등록 목록 미리보기"
            subtitle={`총 ${allPersonnel.length}명 등록됨`}
            right={
              allPersonnel.length > 0 && (
                <Btn variant="ghost" icon="download" onClick={handleExport}>내보내기</Btn>
              )
            }
          />
          <PersonnelTable rows={allPersonnel} rawHeaders={rawHeaders} />
        </Card>

      </div>
    </div>
  )
}
