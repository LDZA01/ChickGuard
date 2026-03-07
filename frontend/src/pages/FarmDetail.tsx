import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Thermometer, Droplets, Wifi } from 'lucide-react'
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
import api from '../services/api'
import type { FarmDetailData } from '../types'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function FarmDetail() {
  const { id } = useParams()
  const [farmData, setFarmData] = useState<FarmDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [feedErrors, setFeedErrors] = useState<Record<string, boolean>>({})
  const { t } = useLanguage()

  useEffect(() => {
    const fetchFarm = async () => {
      setLoading(true)
      if (id) {
        const { data, error } = await api.getFarmDetail(id)
        if (!error && data) {
          setFarmData(data)
        }
      }
      setLoading(false)
    }
    fetchFarm()
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

  if (!farmData) return <div className="p-8 text-center text-red-500 font-bold">{t.farmDetail.notFound}</div>

  const activityChartData = {
    labels: farmData.behaviorData.map(d => `${d.hour}:00`),
    datasets: [{
      label: t.farmDetail.activity,
      data: farmData.behaviorData.map(d => d.activity),
      backgroundColor: 'rgba(240, 117, 24, 0.5)',
    }],
  }

  const farmId = parseInt(farmData.farmId)
  const cameras = farmData.cameras
  // Determine grid layout based on number of cameras
  const gridClass = cameras.length === 1
    ? 'grid-cols-1'
    : cameras.length === 2
      ? 'grid-cols-1 lg:grid-cols-2'
      : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{farmData.name}</h1>
          <p className="text-gray-600 text-sm flex items-center gap-1 mt-0.5">
            <Wifi className="w-3 h-3 text-green-500" />
            {cameras.filter(c => c.status === 'active').length} / {cameras.length} {t.farmDetailExtra.liveFeeds}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">{t.farmDetailExtra.healthScore}</p>
          <p className="text-2xl font-bold text-green-600">{Math.round(farmData.healthScore)}/100</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-gray-600">{t.dashboard.chickens}</p>
          <p className="text-2xl font-bold mt-1">{farmData.currentStats.activeChickens.toLocaleString()}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">{t.farmDetailExtra.feedingPatternAnalysis}</p>
          <p className="text-2xl font-bold mt-1">{farmData.currentStats.feedingRate}%</p>
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

      {/* Live Camera Streams — 1 card per camera */}
      <div className="card space-y-4">
        <h2 className="text-xl font-bold">{t.farmDetailExtra.liveFeeds} · {cameras.length} {cameras.length > 1 ? t.farmDetailExtra.streamsPlural : t.farmDetailExtra.streams}</h2>
        <div className={`grid ${gridClass} gap-4`}>
          {cameras.map((camera, index) => (
            <div
              key={camera.id}
              className="bg-slate-900 rounded-xl overflow-hidden relative border-2 border-slate-700"
              style={{ height: cameras.length === 1 ? '420px' : '260px' }}
            >
              {camera.status === 'active' ? (
                feedErrors[camera.id] ? (
                  <div className="absolute inset-0 bg-slate-800 flex flex-col items-center justify-center text-white gap-2 opacity-60">
                    <p className="text-sm">{t.farmDetailExtra.feedUnavailable}</p>
                  </div>
                ) : (
                <img
                  src={api.getVideoFeedUrl(farmId)}
                  alt={`Camera ${camera.name}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={() => setFeedErrors(prev => ({ ...prev, [camera.id]: true }))}
                />
                )
              ) : (
                <div className="absolute inset-0 bg-slate-800 flex flex-col items-center justify-center text-white gap-2 opacity-60">
                  <p className="text-sm">{t.farmDetailExtra.cameraOffline}</p>
                </div>
              )}

              {/* Overlay: top-left */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                {camera.status === 'active' && (
                  <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded animate-pulse">REC</span>
                )}
                <span className="bg-black/50 backdrop-blur text-white text-[10px] font-mono px-2 py-0.5 rounded">
                  CAM {index + 1} · {camera.name}
                </span>
              </div>

              {/* Overlay: top-right — detection count */}
              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {camera.detections.toLocaleString()} det
              </div>

              {/* Overlay: bottom — zone & location */}
              <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur text-white text-[9px] font-mono px-2 py-0.5 rounded">
                {camera.zone} · {camera.location}
              </div>

              {/* Status dot */}
              <div className={`absolute bottom-2 right-2 w-2 h-2 rounded-full ${camera.status === 'active' ? 'bg-green-400' : 'bg-gray-500'}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Activity Chart */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">{t.farmDetail.hourlyActivity}</h2>
        <div style={{ height: '280px' }}>
          <Bar data={activityChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Environment */}
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
