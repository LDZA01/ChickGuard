import type { LucideIcon } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

type ColorType = 'blue' | 'green' | 'yellow' | 'red' | 'purple'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon?: LucideIcon
  color?: ColorType
}

export default function StatCard({ title, value, change, icon: Icon, color = 'blue' }: StatCardProps) {
  const { t } = useLanguage()
  const isPositive = change !== undefined && change >= 0
  const colorClasses: Record<ColorType, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '↑' : '↓'} {Math.abs(change)}% {t.common.fromYesterday}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-4 rounded-xl ${colorClasses[color]}`}>
            <Icon className="w-8 h-8" />
          </div>
        )}
      </div>
    </div>
  )
}
