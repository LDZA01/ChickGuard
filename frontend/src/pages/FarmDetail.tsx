import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Camera, Thermometer, Droplets } from 'lucide-react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { useLanguage } from '../contexts/LanguageContext'
import { generateFarmDetailData, generateMockData } from '../utils/mockData'
import type { FarmDetailData, Farm } from '../types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function FarmDetail() {
  const { id } = useParams()
  const [farmData, setFarmData] = useState<FarmDetailData | null>(null)
  const [farm, setFarm] = useState<Farm | null>(null)
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    setTimeout(() => {
      const mockData = generateMockData()
      const selectedFarm = mockData.farms.find(f => f.id === id)
      setFarm(selectedFarm || null)
      setFarmData(generateFarmDetailData(id || '1'))
      setLoading(false)
    }, 500)
  }, [id])

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

  if (!farmData || !farm) return <div>{t.farmDetail.notFound}</div>

  const activityChartData = {
    labels: farmData.behaviorData.map(d => `${d.hour}:00`),
    datasets: [{
      label: t.farmDetail.activity,
      data: farmData.behaviorData.map(d => d.activity),
      backgroundColor: 'rgba(240, 117, 24, 0.5)',
    }],
  }

  const getStatusText = (status: string): string => {
    return t.status[status as keyof typeof t.status] || status
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{farm.name}</h1>
          <p className="text-gray-600">{farm.location}</p>
        </div>
        <span className={`badge ${
          farm.status === 'critical' ? 'badge-danger' :
          farm.status === 'warning' ? 'badge-warning' : 'badge-success'
        }`}>
          {getStatusText(farm.status)}
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-gray-600">{t.dashboard.chickens}</p>
          <p className="text-2xl font-bold mt-1">{farm.totalChickens.toLocaleString()}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">{t.dashboard.healthScore}</p>
          <p className="text-2xl font-bold mt-1">{farm.healthScore}/100</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">{t.farmDetail.temperature}</p>
          <p className="text-2xl font-bold mt-1">{farmData.currentStats.temperature}°C</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">{t.farmDetail.humidity}</p>
          <p className="text-2xl font-bold mt-1">{farmData.currentStats.humidity}%</p>
        </div>
      </div>

      {/* Camera Status */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">{t.farmDetail.cameraStatus}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {farmData.cameras.map((camera) => (
            <div key={camera.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span className="font-medium">{t.farmDetail.cameraName} {camera.id}</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  camera.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {camera.status === 'active' ? t.common.active : t.common.inactive}
                </span>
              </div>
              <p className="text-sm text-gray-600">{t.farmDetail.location}: {camera.location}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Chart */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">{t.farmDetail.hourlyActivity}</h2>
        <div style={{ height: '300px' }}>
          <Bar data={activityChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Environment Data */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">{t.farmDetail.environment}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <Thermometer className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t.farmDetail.current} {t.farmDetail.temperature}</p>
              <p className="text-xl font-bold">{farmData.currentStats.temperature}°C</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Droplets className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t.farmDetail.current} {t.farmDetail.humidity}</p>
              <p className="text-xl font-bold">{farmData.currentStats.humidity}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
