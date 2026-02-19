import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Users, AlertTriangle, Activity, Building2, Wifi, WifiOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { generateMockData } from '../utils/mockData'
import api from '../services/api'
import type { DashboardData } from '../types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      
      // Try to fetch from real backend
      const { data, error } = await api.getDashboard()
      
      if (error) {
        console.warn('⚠️  Backend not available, using mock data')
        setIsConnected(false)
        setDashboardData(generateMockData())
      } else {
        console.log('✅ Connected to backend:', data)
        setIsConnected(true)
        // For now, use mock data but mark as connected
        // TODO: Transform backend data format
        setDashboardData(generateMockData())
      }
      
      setLoading(false)
    }

    fetchData()
    
    // Refresh every 5 seconds
    const interval = setInterval(fetchData, 5000)
    
    return () => {
      clearInterval(interval)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t.common.loading}</p>
          <p className="text-sm text-gray-500 mt-2">Connecting to backend...</p>
        </div>
      </div>
    )
  }

  if (!dashboardData) return null

  const chartData = {
    labels: dashboardData.riskTrend.map(d => d.time),
    datasets: [
      {
        label: 'Risk Level',
        data: dashboardData.riskTrend.map(d => d.risk),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value: number | string) {
            return value + '%'
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  return (
    <div className="space-y-6">
      {/* Connection Status Badge */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t.dashboard.title}</h1>
          <p className="text-gray-600 mt-1">{t.dashboard.subtitle}</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
          isConnected 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {isConnected ? (
            <>
              <Wifi className="w-4 h-4" />
              <span>Live AI Data</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4" />
              <span>Mock Data</span>
            </>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t.dashboard.totalChickens}
          value={dashboardData.totalChickens.toLocaleString()}
          icon={Users}
          color="blue"
        />
        <StatCard
          title={t.dashboard.todayAlerts}
          value={dashboardData.activeAlerts}
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title={t.dashboard.avgHealthScore}
          value={`${dashboardData.averageHealth}%`}
          icon={Activity}
          color="green"
        />
        <StatCard
          title={t.dashboard.totalFarms}
          value={dashboardData.farms.length}
          icon={Building2}
          color="purple"
        />
      </div>

      {/* Risk Trend Chart */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">{t.dashboard.riskTrend}</h2>
        <div style={{ height: '300px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Farms Grid */}
      <div>
        <h2 className="text-xl font-bold mb-4">{t.dashboard.allFarms}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardData.farms.map((farm) => (
            <Link
              key={farm.id}
              to={`/farm/${farm.id}`}
              className="card hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{farm.name}</h3>
                  <p className="text-gray-600 text-sm">{farm.location}</p>
                </div>
                <span className={`badge ${getStatusColor(farm.status)}`}>
                  {getStatusText(farm.status, t)}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.dashboard.chickens}</span>
                  <span className="font-semibold">{farm.totalChickens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.dashboard.healthScore}</span>
                  <span className="font-semibold">{farm.healthScore}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.dashboard.status}</span>
                  <span className="font-semibold">{getStatusText(farm.status, t)}</span>
                </div>
              </div>

              {/* Health Score Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getHealthBarColor(farm.healthScore)}`}
                    style={{ width: `${farm.healthScore}%` }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{t.dashboard.recentAlerts}</h2>
          <Link to="/alerts" className="text-primary-600 hover:text-primary-700">
            {t.dashboard.viewAll} →
          </Link>
        </div>
        <div className="space-y-3">
          {dashboardData.alerts.slice(0, 5).map((alert) => (
            <div
              key={alert.id}
              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <AlertTriangle className={`w-5 h-5 mt-0.5 ${getSeverityColor(alert.severity)}`} />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm text-gray-600">{alert.farmName}</p>
                  </div>
                  <span className="text-xs text-gray-500">{alert.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  color: 'blue' | 'red' | 'green' | 'purple'
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-4 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'good':
      return 'badge-success'
    case 'warning':
      return 'badge-warning'
    case 'critical':
      return 'badge-danger'
    default:
      return ''
  }
}

function getStatusText(status: string, t: any): string {
  return t.status[status as keyof typeof t.status] || status
}

function getHealthBarColor(score: number): string {
  if (score >= 80) return 'bg-green-500'
  if (score >= 60) return 'bg-yellow-500'
  return 'bg-red-500'
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'high':
      return 'text-red-600'
    case 'medium':
      return 'text-yellow-600'
    case 'low':
      return 'text-blue-600'
    default:
      return 'text-gray-600'
  }
}
