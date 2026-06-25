import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'

const SAMPLE_DATA = [
  { id: 1, company: 'EcoLogistics Int.', name: 'Sarah Chen', empId: '98231', dept: 'Risk Mgmt', role: 'Safety', email: 's.chen@ecolog.com', status: '승인', checked: false },
  { id: 2, company: 'SafeWork Korea', name: '김민준', empId: '21045', dept: '안전팀', role: 'Health', email: 'mj.kim@safecos.co.kr', status: '대기', checked: false },
  { id: 3, company: 'GreenField Ltd.', name: 'Marcus Thorne', empId: '30017', dept: 'Operations', role: 'Safety', email: 'm.thorne@gf.com', status: '승인', checked: false },
  { id: 4, company: 'EnviroTech Co.', name: '박지수', empId: '40298', dept: '환경팀', role: 'Env', email: 'js.park@enviro.co.kr', status: '반려', checked: false },
  { id: 5, company: 'SafeWork Korea', name: 'Emily Watson', empId: '21088', dept: 'HR', role: 'Safety', email: 'e.watson@safecos.co.kr', status: '대기', checked: false },
]

const STATUS_STYLE = {
  승인: 'bg-green-100 text-green-800',
  대기: 'bg-yellow-100 text-yellow-800',
  반려: 'bg-red-100 text-red-800',
}

export default function Masterlist() {
  const [rows, setRows] = useState(SAMPLE_DATA)
  const [companyFilter, setCompanyFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [selectAll, setSelectAll] = useState(false)
  const fileInputRef = useRef(null)

  const companies = [...new Set(rows.map((r) => r.company))]
  const roles = [...new Set(rows.map((r) => r.role))]

  const filtered = rows.filter((r) => {
    if (companyFilter && r.company !== companyFilter) return false
    if (roleFilter && r.role !== roleFilter) return false
    return true
  })

  const toggleAll = (checked) => {
    setSelectAll(checked)
    setRows((prev) => prev.map((r) => ({ ...r, checked })))
  }

  const toggleRow = (id) => {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, checked: !r.checked } : r))
  }

  const selectedIds = rows.filter((r) => r.checked).map((r) => r.id)

  const handleApprove = () => {
    setRows((prev) => prev.map((r) => selectedIds.includes(r.id) ? { ...r, status: '승인', checked: false } : r))
    setSelectAll(false)
  }

  const handleExport = () => {
    const exportData = filtered.map((r) => ({
      회사: r.company, 성명: r.name, 사번: r.empId, 부서: r.dept, 역할: r.role, 이메일: r.email, 상태: r.status,
    }))
    const ws = XLSX.utils.json_to_sheet(exportData)
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
        id: Date.now() + i,
        company: row['회사'] || '',
        name: row['성명'] || '',
        empId: row['사번'] || '',
        dept: row['부서'] || '',
        role: row['역할'] || '',
        email: row['이메일'] || '',
        status: row['상태'] || '대기',
        checked: false,
      }))
      setRows((prev) => [...prev, ...imported])
    }
    reader.readAsArrayBuffer(file)
    e.target.value = ''
  }

  return (
    <section className="p-6 max-w-[1440px] mx-auto space-y-6">
      <div className="space-y-1">
        <h3 className="text-3xl font-bold font-serif text-on-surface">마스터 명단</h3>
        <p className="text-sm text-on-surface-variant">전체 등록 담당자를 조회하고 관리합니다.</p>
      </div>

      {/* Filter + Actions bar */}
      <div className="flex justify-between items-center bg-white border border-outline-variant rounded-xl p-4 flex-wrap gap-3">
        <div className="flex gap-3 flex-wrap">
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="border border-outline-variant rounded-lg h-9 text-xs px-3 bg-white"
          >
            <option value="">전체 회사</option>
            {companies.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-outline-variant rounded-lg h-9 text-xs px-3 bg-white"
          >
            <option value="">전체 역할</option>
            {roles.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <button
            onClick={() => { setCompanyFilter(''); setRoleFilter('') }}
            className="bg-secondary-container text-on-secondary-container h-9 px-4 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-secondary-container/80 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>filter_list</span>
            필터 초기화
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleImport}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="border border-secondary-container text-secondary h-9 px-4 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-secondary-container/20 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>upload</span>
            엑셀 가져오기
          </button>
          <button
            onClick={handleExport}
            className="border border-primary text-primary h-9 px-4 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-primary/5 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>download</span>
            엑셀 내보내기
          </button>
          <button
            onClick={handleApprove}
            disabled={selectedIds.length === 0}
            className="bg-primary text-on-primary h-9 px-4 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check_circle</span>
            선택 승인 ({selectedIds.length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-surface-container-low border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm">관리자 디렉토리</h4>
            <span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full text-[10px] font-bold">
              {filtered.length}개 결과
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={(e) => toggleAll(e.target.checked)}
                    className="rounded"
                  />
                </th>
                <th className="p-4 text-on-surface-variant font-semibold">회사</th>
                <th className="p-4 text-on-surface-variant font-semibold">성명</th>
                <th className="p-4 text-on-surface-variant font-semibold">부서</th>
                <th className="p-4 text-on-surface-variant font-semibold">역할</th>
                <th className="p-4 text-on-surface-variant font-semibold">이메일</th>
                <th className="p-4 text-on-surface-variant font-semibold">상태</th>
                <th className="p-4 text-right text-on-surface-variant font-semibold">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {filtered.map((row) => (
                <tr key={row.id} className={`transition-colors ${row.checked ? 'bg-primary-container/10' : 'hover:bg-surface-container-low/30'}`}>
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={row.checked}
                      onChange={() => toggleRow(row.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="p-4 font-bold">{row.company}</td>
                  <td className="p-4">
                    {row.name}
                    <br />
                    <span className="text-[10px] text-on-surface-variant italic font-mono">ID: {row.empId}</span>
                  </td>
                  <td className="p-4">{row.dept}</td>
                  <td className="p-4">
                    <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">{row.role}</span>
                  </td>
                  <td className="p-4 font-mono text-on-surface-variant">{row.email}</td>
                  <td className="p-4">
                    <span className={`${STATUS_STYLE[row.status]} px-2 py-0.5 rounded-full text-[10px] font-bold`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-primary hover:bg-primary/10 p-1 rounded transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-on-surface-variant">
            <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>inbox</span>
            <p className="mt-2 text-sm">표시할 데이터가 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  )
}
