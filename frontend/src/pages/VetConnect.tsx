import { useState } from 'react'
import {
  Video,
  MessageCircle,
  Phone,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  ChevronRight,
  Wifi,
  Shield,
  FileText,
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

// ─── Types ────────────────────────────────────────────────────────────────────

type Lang = 'th' | 'en'

interface BilingualString {
  th: string
  en: string
}

interface VetData {
  id: number
  name: BilingualString
  specialty: BilingualString
  hospital: BilingualString
  rating: number
  reviewCount: number
  experience: number
  status: 'online' | 'busy' | 'offline'
  nextSlot: BilingualString
  avatar: string
  tags: { th: string[]; en: string[] }
  consultFee: number
}

interface CaseData {
  id: string
  farm: string
  vet: BilingualString
  date: BilingualString
  issue: BilingualString
  status: string
  summary: BilingualString
}

// ─── Mock Data (bilingual) ────────────────────────────────────────────────────

const VETS: VetData[] = [
  {
    id: 1,
    name: { th: 'น.สพ. ดร. วิชัย ศรีสมบัติ', en: 'Dr. Wichai Srisombat' },
    specialty: { th: 'โรคสัตว์ปีก & ระบาดวิทยา', en: 'Poultry Disease & Epidemiology' },
    hospital: { th: 'คณะสัตวแพทยศาสตร์ จุฬาฯ', en: 'Faculty of Vet Sci, Chulalongkorn' },
    rating: 4.9,
    reviewCount: 128,
    experience: 15,
    status: 'online',
    nextSlot: { th: 'ว่างตอนนี้', en: 'Available now' },
    avatar: '👨‍⚕️',
    tags: { th: ['ไข้หวัดนก', 'นิวคาสเซิล', 'หลอดลมอักเสบ'], en: ['Avian Influenza', 'Newcastle', 'IB'] },
    consultFee: 500,
  },
  {
    id: 2,
    name: { th: 'สพ.ญ. ปิยะนุช รัตนมาลา', en: 'Dr. Piyanuch Rattanamala' },
    specialty: { th: 'สุขภาพและการจัดการฟาร์มปศุสัตว์', en: 'Livestock Farm Health Management' },
    hospital: { th: 'มหาวิทยาลัยเกษตรศาสตร์', en: 'Kasetsart University' },
    rating: 4.8,
    reviewCount: 95,
    experience: 10,
    status: 'busy',
    nextSlot: { th: 'ว่าง 14:30 น.', en: 'Available at 14:30' },
    avatar: '👩‍⚕️',
    tags: { th: ['Biosecurity', 'วัคซีน', 'โภชนาการ'], en: ['Biosecurity', 'Vaccines', 'Nutrition'] },
    consultFee: 400,
  },
  {
    id: 3,
    name: { th: 'น.สพ. ธนพล จันทร์เพ็ญ', en: 'Dr. Thanaphon Chanpen' },
    specialty: { th: 'พยาธิวิทยาสัตว์ปีก', en: 'Poultry Pathology' },
    hospital: { th: 'กรมปศุสัตว์', en: 'Department of Livestock Development' },
    rating: 4.7,
    reviewCount: 67,
    experience: 8,
    status: 'offline',
    nextSlot: { th: 'ว่างพรุ่งนี้ 09:00 น.', en: 'Available tomorrow 09:00' },
    avatar: '👨‍⚕️',
    tags: { th: ['วินิจฉัยโรค', 'ชันสูตร', 'รายงาน'], en: ['Diagnosis', 'Necropsy', 'Reports'] },
    consultFee: 350,
  },
]

const RECENT_CASES: CaseData[] = [
  {
    id: 'C-2026-0301',
    farm: 'Healthy Farm 1',
    vet: { th: 'น.สพ. ดร. วิชัย ศรีสมบัติ', en: 'Dr. Wichai Srisombat' },
    date: { th: '1 มี.ค. 2569', en: '1 Mar 2026' },
    issue: { th: 'การเคลื่อนไหวผิดปกติ — Risk Score 72', en: 'Abnormal movement — Risk Score 72' },
    status: 'resolved',
    summary: {
      th: 'ตรวจพบอาการเริ่มต้นของ Newcastle Disease แนะนำให้วัคซีน และเพิ่มอากาศถ่ายเท',
      en: 'Early signs of Newcastle Disease detected. Recommended vaccination and improved ventilation.',
    },
  },
  {
    id: 'C-2026-0215',
    farm: 'Healthy Farm 2',
    vet: { th: 'สพ.ญ. ปิยะนุช รัตนมาลา', en: 'Dr. Piyanuch Rattanamala' },
    date: { th: '15 ก.พ. 2569', en: '15 Feb 2026' },
    issue: { th: 'การกระจุกตัวแน่น — Risk Score 65', en: 'Dense clustering — Risk Score 65' },
    status: 'resolved',
    summary: {
      th: 'ปรับการกระจายอุณหภูมิภายในโรงเรือน อาการดีขึ้นภายใน 48 ชั่วโมง',
      en: 'Adjusted temperature distribution inside barn. Condition improved within 48 hours.',
    },
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: 'online' | 'busy' | 'offline' }) {
  const { t } = useLanguage()
  const map = {
    online: { label: t.vetConnect.statusOnline, cls: 'bg-green-100 text-green-700' },
    busy: { label: t.vetConnect.statusBusy, cls: 'bg-yellow-100 text-yellow-700' },
    offline: { label: t.vetConnect.statusOffline, cls: 'bg-gray-100 text-gray-500' },
  }
  const { label, cls } = map[status]
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{label}</span>
  )
}

function VetCard({ vet, onSelect }: { vet: VetData; onSelect: (v: VetData) => void }) {
  const { t, language } = useLanguage()
  const lang = language as Lang
  return (
    <div className="card hover:shadow-lg transition-all cursor-pointer" onClick={() => onSelect(vet)}>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-3xl">
            {vet.avatar}
          </div>
          <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${vet.status === 'online' ? 'bg-green-500' :
            vet.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
            }`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-bold text-gray-900 leading-tight">{vet.name[lang]}</p>
              <p className="text-sm text-primary-600 mt-0.5">{vet.specialty[lang]}</p>
              <p className="text-xs text-gray-500 mt-0.5">{vet.hospital[lang]}</p>
            </div>
            <StatusBadge status={vet.status} />
          </div>

          {/* Rating & Experience */}
          <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="font-medium text-gray-800">{vet.rating}</span>
              <span className="text-gray-400">({vet.reviewCount})</span>
            </span>
            <span className="text-gray-300">|</span>
            <span>{vet.experience} {t.vetConnect.yearsExp}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            {vet.tags[lang].map(tag => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>{vet.nextSlot[lang]}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800">฿{vet.consultFee} {t.vetConnect.perSession}</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  )
}

// ─── Consult Modal ────────────────────────────────────────────────────────────

function ConsultModal({ vet, onClose }: { vet: VetData; onClose: () => void }) {
  const { t, language } = useLanguage()
  const lang = language as Lang
  const [step, setStep] = useState<'select' | 'confirm' | 'session'>('select')
  const [mode, setMode] = useState<'video' | 'chat' | 'phone'>('video')

  const modeOptions = [
    { key: 'video' as const, icon: Video, label: t.vetConnect.modeVideo, desc: t.vetConnect.modeVideoDesc, price: vet.consultFee },
    { key: 'chat' as const, icon: MessageCircle, label: t.vetConnect.modeChat, desc: t.vetConnect.modeChatDesc, price: Math.round(vet.consultFee * 0.6) },
    { key: 'phone' as const, icon: Phone, label: t.vetConnect.modePhone, desc: t.vetConnect.modePhoneDesc, price: Math.round(vet.consultFee * 0.8) },
  ]

  const selectedMode = modeOptions.find(m => m.key === mode)

  // Remove the backdrop div and just render modal in a separate positioned context
  return (
    <>
      {/* Modal container */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center px-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto">
          {/* Header */}
          <div className="bg-primary-500 px-6 py-4 flex items-center gap-3 rounded-t-2xl">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-2xl">{vet.avatar}</div>
            <div className="flex-1">
              <p className="font-bold text-white">{vet.name[lang]}</p>
              <p className="text-primary-100 text-xs">{vet.specialty[lang]}</p>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white text-xl leading-none">✕</button>
          </div>

          <div className="bg-white p-6">
            {step === 'select' && (
              <>
                <p className="font-semibold text-gray-800 mb-4">{t.vetConnect.selectConsultMode}</p>

                {/* AI Risk Banner */}
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4 flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-orange-800">
                    <span className="font-semibold">{t.vetConnect.aiDetectedBanner}</span> {t.vetConnect.aiDetectedDesc}
                  </div>
                </div>

                <div className="space-y-2">
                  {modeOptions.map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => setMode(opt.key)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${mode === opt.key ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className={`p-2 rounded-lg ${mode === opt.key ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        <opt.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-800">{opt.label}</p>
                        <p className="text-xs text-gray-500">{opt.desc}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">฿{opt.price}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setStep('confirm')}
                  className="w-full mt-4 bg-primary-500 text-white py-3 rounded-xl font-bold hover:bg-primary-600 transition-colors"
                >
                  {t.vetConnect.proceed}
                </button>
              </>
            )}

            {step === 'confirm' && (
              <>
                <p className="font-semibold text-gray-800 mb-4">{t.vetConnect.confirmAppointment}</p>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.vetConnect.confirmVet}</span>
                    <span className="font-medium">{vet.name[lang]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.vetConnect.confirmMode}</span>
                    <span className="font-medium">{selectedMode?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.vetConnect.confirmFarm}</span>
                    <span className="font-medium">{t.vetConnect.farmLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.vetConnect.confirmAiData}</span>
                    <span className="font-medium text-orange-600">{t.vetConnect.confirmAiDataValue}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                    <span>{t.vetConnect.confirmTotal}</span>
                    <span>฿{selectedMode?.price}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setStep('select')} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50">
                    {t.vetConnect.back}
                  </button>
                  <button onClick={() => setStep('session')} className="flex-1 bg-primary-500 text-white py-3 rounded-xl text-sm font-bold hover:bg-primary-600">
                    {t.vetConnect.confirmConnect}
                  </button>
                </div>
              </>
            )}

            {step === 'session' && (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <p className="font-bold text-gray-900 text-lg mb-1">{t.vetConnect.connecting}</p>
                <p className="text-sm text-gray-500 mb-4">{t.vetConnect.connectingDesc}</p>

                {/* Mock session UI */}
                <div className="bg-gray-900 rounded-xl p-4 text-left mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-white text-xs font-medium">LIVE — {t.vetConnect.farmLabel} · CAM-01</span>
                  </div>
                  <div className="h-24 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                    {t.vetConnect.liveStream}
                  </div>
                  <div className="mt-2 bg-orange-900/50 rounded-lg p-2">
                    <p className="text-orange-300 text-xs">📊 Risk Score: 72 · Movement ↓ · Clustering ↑</p>
                  </div>
                </div>

                <p className="text-xs text-gray-400">{t.vetConnect.mockupNote}</p>
                <button onClick={onClose} className="mt-3 text-sm text-primary-600 hover:underline">
                  {t.vetConnect.closeWindow}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function VetConnect() {
  const { t, language } = useLanguage()
  const lang = language as Lang
  const [selectedVet, setSelectedVet] = useState<VetData | null>(null)
  const [activeTab, setActiveTab] = useState<'find' | 'history'>('find')

  const filters = [
    t.vetConnect.filterAll,
    t.vetConnect.filterOnlineNow,
    t.vetConnect.filterPoultry,
    t.vetConnect.filterBiosecurity,
  ]

  return (
    <>
      {/* Page content – blurred when modal is open using CSS filter (not backdrop-filter) */}
      <div
        className="space-y-6 transition-[filter] duration-200"
        style={selectedVet ? { filter: 'blur(3px)', pointerEvents: 'none', userSelect: 'none' } : undefined}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t.vetConnect.title}</h1>
            <p className="text-gray-600 mt-1">{t.vetConnect.subtitle}</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
            <Wifi className="w-3 h-3" />
            <span>{t.vetConnect.aiDataConnected}</span>
          </div>
        </div>

        {/* Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Shield, title: t.vetConnect.aiAssistedConsult, desc: t.vetConnect.aiAssistedConsultDesc, color: 'text-blue-600 bg-blue-50' },
            { icon: Video, title: t.vetConnect.liveFarmView, desc: t.vetConnect.liveFarmViewDesc, color: 'text-purple-600 bg-purple-50' },
            { icon: FileText, title: t.vetConnect.digitalRecords, desc: t.vetConnect.digitalRecordsDesc, color: 'text-green-600 bg-green-50' },
          ].map(item => (
            <div key={item.title} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-start gap-3">
              <div className={`p-2.5 rounded-xl flex-shrink-0 ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {[
            { key: 'find', label: t.vetConnect.findVet },
            { key: 'history', label: t.vetConnect.consultHistory },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'find' | 'history')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Find Tab */}
        {activeTab === 'find' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500">{t.vetConnect.filterBy}</span>
              {filters.map((f, i) => (
                <button
                  key={f}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${i === 0 ? 'bg-primary-500 text-white border-primary-500' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* AI Alert */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-orange-800 text-sm">{t.vetConnect.aiAlertTitle}</p>
                <p className="text-xs text-orange-700 mt-0.5">{t.vetConnect.aiAlertDesc}</p>
              </div>
              <button
                className="flex-shrink-0 bg-orange-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-orange-600 font-medium"
                onClick={() => setSelectedVet(VETS[0])}
              >
                {t.vetConnect.consultNow}
              </button>
            </div>

            {/* Vet Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {VETS.map(vet => (
                <VetCard key={vet.id} vet={vet} onSelect={setSelectedVet} />
              ))}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              {t.vetConnect.historyCount} {RECENT_CASES.length} {t.vetConnect.historyCountUnit}
            </p>
            {RECENT_CASES.map(c => (
              <div key={c.id} className="card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-gray-400">{c.id}</span>
                      <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        {t.vetConnect.resolved}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-800">{c.farm}</p>
                    <p className="text-sm text-orange-600 mt-0.5">{c.issue[lang]}</p>
                    <p className="text-xs text-gray-500 mt-1">{t.vetConnect.vetLabel} {c.vet[lang]}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {c.date[lang]}
                    </div>
                  </div>
                </div>
                <div className="mt-3 bg-gray-50 rounded-lg p-3 border-l-4 border-primary-300">
                  <p className="text-xs text-gray-700 leading-relaxed">
                    <span className="font-semibold text-gray-800">{t.vetConnect.diagnosisSummary} </span>
                    {c.summary[lang]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500">
            🚧 <span className="font-semibold">{t.vetConnect.title}</span> {t.vetConnect.disclaimerText}
          </p>
        </div>
      </div>

      {/* Consult Modal – outside blurred wrapper so it's not affected by filter */}
      {selectedVet && (
        <ConsultModal vet={selectedVet} onClose={() => setSelectedVet(null)} />
      )}
    </>
  )
}
