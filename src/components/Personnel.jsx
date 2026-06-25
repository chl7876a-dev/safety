import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'

const DEPARTMENTS = ['운영팀', '안전팀', '환경팀', '총무팀', '기술팀', '품질팀']
const ROLES = ['안전 관리자', '환경 관리자', '현장 감독', '안전보건관리자', '위험물관리자', '소방안전관리자']

function ExcelUploadZone({ onDataLoaded }) {
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState(null)
  const [error, setError] = useState(null)
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
        const data = XLSX.utils.sheet_to_json(ws, { defval: '' })
        onDataLoaded(data, file.name)
      } catch {
        setError('파일을 읽는 중 오류가 발생했습니다.')
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    processFile(file)
  }

  const handleFileChange = (e) => {
    processFile(e.target.files[0])
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`upload-zone bg-white border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[240px] cursor-pointer transition-all ${dragging ? 'dragging' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="w-14 h-14 bg-surface-container-high rounded-full flex items-center justify-center text-primary">
          <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>upload_file</span>
        </div>
        {fileName ? (
          <>
            <p className="text-sm font-semibold text-primary">{fileName}</p>
            <p className="text-xs text-on-surface-variant">파일이 로드되었습니다. 다른 파일을 선택하려면 클릭하세요.</p>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold text-on-surface">엑셀 파일 업로드</p>
            <p className="text-xs text-on-surface-variant">
              .xlsx, .xls, .csv 파일을 여기에 끌어다 놓거나<br />클릭하여 파일을 선택하세요
            </p>
          </>
        )}
        <button
          type="button"
          className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors"
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
        >
          파일 선택
        </button>
        {error && <p className="text-xs text-error">{error}</p>}
      </div>

      <div className="bg-white border border-outline-variant rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary">description</span>
          <div>
            <p className="text-xs font-semibold">엑셀 템플릿 다운로드</p>
            <p className="text-[10px] text-on-surface-variant">성명, 부서, 직무, 이메일, 연락처 포함</p>
          </div>
        </div>
        <button
          className="text-primary text-xs font-semibold flex items-center gap-1 hover:underline"
          onClick={() => {
            const ws = XLSX.utils.aoa_to_sheet([['성명', '부서', '직무', '이메일', '연락처', '사업장']])
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, '담당자목록')
            XLSX.writeFile(wb, '담당자_등록_템플릿.xlsx')
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
          다운로드
        </button>
      </div>

      <div className="bg-surface-container-low/50 border border-primary/10 rounded-xl p-4 flex gap-3">
        <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px' }}>info</span>
        <div className="text-xs text-on-surface-variant space-y-1">
          <p className="font-semibold text-on-surface">업로드 형식 안내</p>
          <p>첫 번째 행은 열 제목(헤더)이어야 합니다.</p>
          <p>필수 열: <strong>성명, 부서, 직무, 이메일</strong></p>
          <p>선택 열: 연락처, 사업장, 입사일, 자격증번호</p>
        </div>
      </div>
    </div>
  )
}

function DirectInputForm({ onAdd }) {
  const [form, setForm] = useState({ name: '', department: '', role: '', email: '', phone: '', site: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = '성명을 입력하세요.'
    if (!form.department) e.department = '부서를 선택하세요.'
    if (!form.role) e.role = '직무를 선택하세요.'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = '올바른 이메일을 입력하세요.'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onAdd({ ...form, id: Date.now() })
    setForm({ name: '', department: '', role: '', email: '', phone: '', site: '' })
    setErrors({})
  }

  const field = (key, label, type = 'text', placeholder = '') => (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-on-surface">
        {label} {['name', 'department', 'role', 'email'].includes(key) && <span className="text-error">*</span>}
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder}
        className={`w-full border rounded-lg px-3 py-2 text-sm transition-all ${errors[key] ? 'border-error' : 'border-outline-variant'}`}
      />
      {errors[key] && <p className="text-[10px] text-error">{errors[key]}</p>}
    </div>
  )

  const select = (key, label, options) => (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-on-surface">
        {label} <span className="text-error">*</span>
      </label>
      <select
        value={form[key]}
        onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
        className={`w-full border rounded-lg px-3 py-2 text-sm transition-all ${errors[key] ? 'border-error' : 'border-outline-variant'}`}
      >
        <option value="">선택하세요</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {errors[key] && <p className="text-[10px] text-error">{errors[key]}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {field('name', '성명', 'text', '홍길동')}
        {select('department', '부서', DEPARTMENTS)}
        {select('role', '직무', ROLES)}
        {field('email', '이메일', 'email', 'email@company.com')}
        {field('phone', '연락처', 'tel', '010-0000-0000')}
        {field('site', '사업장', 'text', '서울 본사')}
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-secondary text-on-secondary px-6 py-3 rounded-xl text-sm font-semibold hover:bg-secondary/90 transition-colors"
        >
          목록에 추가
        </button>
      </div>
    </form>
  )
}

export default function Personnel() {
  const [uploadedData, setUploadedData] = useState([])
  const [uploadedFileName, setUploadedFileName] = useState(null)
  const [manualList, setManualList] = useState([])
  const [tab, setTab] = useState('upload')

  const handleDataLoaded = (data, filename) => {
    setUploadedData(data)
    setUploadedFileName(filename)
  }

  const handleAddManual = (person) => {
    setManualList((prev) => [...prev, person])
  }

  const allPersonnel = [
    ...uploadedData.map((row, i) => ({
      id: `upload-${i}`,
      name: row['성명'] || row['name'] || '',
      department: row['부서'] || row['department'] || '',
      role: row['직무'] || row['role'] || '',
      email: row['이메일'] || row['email'] || '',
      source: 'excel',
    })),
    ...manualList.map((p) => ({ ...p, source: 'manual' })),
  ]

  return (
    <section className="p-6 max-w-[1440px] mx-auto space-y-6">
      <div className="space-y-2">
        <h3 className="text-3xl font-bold font-serif text-on-surface">담당자 정보 등록</h3>
        <div className="p-4 bg-surface-container-low rounded-xl border border-primary/10 flex gap-3">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px' }}>info</span>
          <p className="text-sm text-on-surface-variant">
            표준 템플릿을 사용한 엑셀 일괄 업로드 또는 개별 직접 입력이 가능합니다. 별표(*) 표시된 항목은 필수 입력입니다.
          </p>
        </div>
      </div>

      {/* Tab */}
      <div className="flex gap-2 border-b border-outline-variant">
        {[
          { id: 'upload', label: '엑셀 업로드', icon: 'upload_file' },
          { id: 'manual', label: '직접 입력', icon: 'edit_note' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all -mb-px ${
              tab === t.id
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left panel */}
        <div className="lg:col-span-5">
          {tab === 'upload' ? (
            <ExcelUploadZone onDataLoaded={handleDataLoaded} />
          ) : (
            <div className="bg-white border border-outline-variant rounded-xl p-6">
              <h4 className="text-lg font-bold font-serif border-b border-outline-variant pb-4 mb-6">직접 입력</h4>
              <DirectInputForm onAdd={handleAddManual} />
            </div>
          )}
        </div>

        {/* Right panel — preview table */}
        <div className="lg:col-span-7 bg-white border border-outline-variant rounded-xl overflow-hidden">
          <div className="p-4 border-b border-outline-variant bg-surface-container-low/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold font-serif">등록 목록 미리보기</h4>
              <span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full text-[10px] font-bold">
                {allPersonnel.length}명
              </span>
            </div>
            {allPersonnel.length > 0 && (
              <button
                className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
                onClick={() => {
                  const ws = XLSX.utils.json_to_sheet(allPersonnel.map((p) => ({
                    성명: p.name, 부서: p.department, 직무: p.role, 이메일: p.email,
                  })))
                  const wb = XLSX.utils.book_new()
                  XLSX.utils.book_append_sheet(wb, ws, '담당자목록')
                  XLSX.writeFile(wb, '등록_담당자_목록.xlsx')
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>download</span>
                내보내기
              </button>
            )}
          </div>

          {allPersonnel.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '40px' }}>inbox</span>
              <p className="text-sm text-on-surface-variant">엑셀 파일을 업로드하거나 직접 입력하면<br />여기에 목록이 표시됩니다.</p>
            </div>
          ) : (
            <div className="overflow-auto max-h-[480px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b sticky top-0">
                  <tr>
                    <th className="p-3 text-on-surface-variant font-semibold">성명</th>
                    <th className="p-3 text-on-surface-variant font-semibold">부서</th>
                    <th className="p-3 text-on-surface-variant font-semibold">직무</th>
                    <th className="p-3 text-on-surface-variant font-semibold">이메일</th>
                    <th className="p-3 text-on-surface-variant font-semibold">출처</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {allPersonnel.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="p-3 font-semibold">{p.name || '-'}</td>
                      <td className="p-3">{p.department || '-'}</td>
                      <td className="p-3">{p.role || '-'}</td>
                      <td className="p-3 font-mono text-on-surface-variant">{p.email || '-'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.source === 'excel'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {p.source === 'excel' ? '엑셀' : '직접입력'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
