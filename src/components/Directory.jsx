import { useState } from 'react'

const SAMPLE_PEOPLE = [
  { id: 1, name: 'Marcus Thorne', role: '최고 안전 책임자', email: 'm.thorne@envirosafe.com', site: '본사, 12층', status: '현장 근무', avatar: 'MT' },
  { id: 2, name: '김민준', role: '안전 관리자', email: 'mj.kim@safecos.co.kr', site: '부산 공장, 3층', status: '재택 근무', avatar: '김' },
  { id: 3, name: '박지수', role: '환경 관리자', email: 'js.park@greentech.kr', site: '대전 연구소, 5층', status: '현장 근무', avatar: '박' },
  { id: 4, name: 'Sarah Chen', role: '위험물 관리자', email: 's.chen@ecolog.com', site: '인천 물류센터, 1층', status: '출장 중', avatar: 'SC' },
  { id: 5, name: '이재현', role: '소방안전관리자', email: 'jh.lee@safecos.co.kr', site: '서울 사무소, 8층', status: '현장 근무', avatar: '이' },
  { id: 6, name: 'Emily Watson', role: '안전보건관리자', email: 'e.watson@envirosafe.com', site: '본사, 9층', status: '재택 근무', avatar: 'EW' },
]

const STATUS_STYLES = {
  '현장 근무': 'bg-green-50 text-green-700 border border-green-200',
  '재택 근무': 'bg-blue-50 text-blue-700 border border-blue-200',
  '출장 중': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
}

export default function Directory() {
  const [query, setQuery] = useState('')

  const filtered = SAMPLE_PEOPLE.filter((p) => {
    const q = query.toLowerCase()
    return (
      p.name.toLowerCase().includes(q) ||
      p.role.toLowerCase().includes(q) ||
      p.site.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q)
    )
  })

  return (
    <section className="p-6 max-w-[1440px] mx-auto space-y-6">
      <div className="text-center py-8 space-y-4">
        <h3 className="text-4xl font-bold font-serif text-on-surface">안전환경 담당자 명단 조회</h3>
        <p className="text-sm text-on-surface-variant max-w-xl mx-auto">
          모든 사업장의 지역 안전 및 환경 관리자를 신속하게 찾아 연락할 수 있습니다.
        </p>

        <div className="max-w-2xl mx-auto bg-white p-1 rounded-full border border-outline-variant shadow-sm flex items-center">
          <div className="px-4 py-2 flex items-center flex-grow gap-3">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>person_search</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="성명, 사업장, 또는 역할로 검색..."
              className="w-full bg-transparent border-none text-sm focus:outline-none focus:ring-0"
            />
          </div>
          <button className="bg-primary text-on-primary px-6 py-2 rounded-full text-sm font-semibold mr-1 hover:bg-primary/90 transition-colors">
            검색
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant">
          <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>search_off</span>
          <p className="mt-2 text-sm">검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((person) => (
            <div
              key={person.id}
              className="bg-white border border-outline-variant rounded-xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold text-sm">
                    {person.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-on-surface text-sm">{person.name}</p>
                    <p className="text-xs text-primary font-bold">{person.role}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${STATUS_STYLES[person.status]}`}>
                  {person.status}
                </span>
              </div>

              <div className="space-y-2 text-xs text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>mail</span>
                  <span className="font-mono">{person.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span>
                  <span>{person.site}</span>
                </div>
              </div>

              <button className="w-full py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs font-bold hover:bg-surface-container-high transition-colors">
                프로필 보기
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
