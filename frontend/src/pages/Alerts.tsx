import { useState, useEffect } from 'react'
import { Filter, Search } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import AlertCard from '../components/AlertCard'
import api from '../services/api'
import type { Alert } from '../types'

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([])
  const [selectedSeverity, setSelectedSeverity] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true)
      const { data, error } = await api.getDashboard()
      if (!error && data && data.alerts) {
        setAlerts(data.alerts)
        setFilteredAlerts(data.alerts)
      }
      setLoading(false)
    }
    fetchAlerts()
  }, [])

  useEffect(() => {
    let filtered = alerts

    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(alert => alert.severity === selectedSeverity)
    }

    if (searchQuery) {
      filtered = filtered.filter(alert =>
        alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.farmName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredAlerts(filtered)
  }, [selectedSeverity, searchQuery, alerts])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t.common.loading}</p>
        </div>
      </div>
    )
  }

  const severityCounts = {
    all: alerts.length,
    high: alerts.filter(a => a.severity === 'high').length,
    medium: alerts.filter(a => a.severity === 'medium').length,
    low: alerts.filter(a => a.severity === 'low').length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t.alerts.title}</h1>
        <p className="text-gray-600 mt-1">{t.alerts.subtitle}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { key: 'all', label: t.alerts.all, color: 'blue' },
          { key: 'high', label: t.alerts.high, color: 'red' },
          { key: 'medium', label: t.alerts.medium, color: 'yellow' },
          { key: 'low', label: t.alerts.low, color: 'green' },
        ].map(({ key, label, color }) => (
          <div
            key={key}
            className={`card cursor-pointer ${selectedSeverity === key ? `ring-2 ring-${color}-500` : ''
              }`}
            onClick={() => setSelectedSeverity(key)}
          >
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-2xl font-bold mt-1">
              {severityCounts[key as keyof typeof severityCounts]}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t.alerts.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">{t.alerts.all}</option>
              <option value="high">{t.alerts.high}</option>
              <option value="medium">{t.alerts.medium}</option>
              <option value="low">{t.alerts.low}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">{t.alerts.noAlerts}</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
        )}
      </div>
    </div>
  )
}
