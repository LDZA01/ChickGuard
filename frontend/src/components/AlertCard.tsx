import { AlertTriangle, Info, AlertCircle } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import type { Alert } from '../types'

interface AlertCardProps {
  alert: Alert
}

export default function AlertCard({ alert }: AlertCardProps) {
  const { t } = useLanguage()
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-5 h-5" />
      case 'medium': return <AlertCircle className="w-5 h-5" />
      case 'low': return <Info className="w-5 h-5" />
      default: return <Info className="w-5 h-5" />
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high': return t.alerts.high
      case 'medium': return t.alerts.medium
      case 'low': return t.alerts.low
      default: return severity
    }
  }

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
            {getSeverityIcon(alert.severity)}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">{alert.farmName}</h3>
              <span className={`px-2 py-1 text-xs rounded-full border ${getSeverityColor(alert.severity)}`}>
                {getSeverityText(alert.severity)}
              </span>
            </div>
            <p className="text-gray-600 mt-1">{alert.message}</p>
            <p className="text-sm text-gray-500 mt-2">{alert.timestamp}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
