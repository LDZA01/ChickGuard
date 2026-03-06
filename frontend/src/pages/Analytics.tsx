import { useState, useEffect } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { TrendingUp, TrendingDown, Activity, AlertTriangle, CloudRain, Target } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import api from '../services/api'
import type { AnalyticsData } from '../types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      const { data, error } = await api.getAnalytics()
      if (!error && data) {
        setAnalyticsData(data)
      }
      setLoading(false)
    }
    fetchAnalytics()
  }, [])

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

  if (!analyticsData) return null

  const healthTrendChartData = {
    labels: analyticsData.healthTrend.map(d => d.date),
    datasets: [
      {
        label: t.analytics.healthTrend,
        data: analyticsData.healthTrend.map(d => d.health),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const productionChartData = {
    labels: analyticsData.productionMetrics.map(d => d.week),
    datasets: [
      {
        label: t.analytics.weight + ' (' + t.analytics.kg + ')',
        data: analyticsData.productionMetrics.map(d => d.weight),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: t.analytics.mortality + ' (' + t.analytics.percent + ')',
        data: analyticsData.productionMetrics.map(d => d.mortality),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t.analytics.title}</h1>
        <p className="text-gray-600 mt-1">{t.analytics.subtitle}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-green-600" />
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm text-gray-600">Normal Behavior</p>
          <p className="text-2xl font-bold mt-1">
            {analyticsData.behaviorAnalysis.filter(b => b.activity > 50).length}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-yellow-600" />
            <TrendingDown className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-sm text-gray-600">Abnormal Behavior</p>
          <p className="text-2xl font-bold mt-1">
            {analyticsData.behaviorAnalysis.filter(b => b.activity <= 50 && b.activity > 30).length}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-red-600" />
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-sm text-gray-600">Alert Required</p>
          <p className="text-2xl font-bold mt-1">
            {analyticsData.behaviorAnalysis.filter(b => b.activity <= 30).length}
          </p>
        </div>
      </div>

      {/* Health Trend Chart */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t.analytics.healthTrend}</h2>
        <div style={{ height: '300px' }}>
          <Line
            data={healthTrendChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                title: { display: true, text: t.analytics.healthTrend }
              }
            }}
          />
        </div>
      </div>

      {/* Production Metrics */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t.analytics.productionMetrics}</h2>
        <div style={{ height: '300px' }}>
          <Bar
            data={productionChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' }
              }
            }}
          />
        </div>
      </div>

      {/* Disease Risk */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">{t.analytics.diseaseRisk}</h2>
          <div className="space-y-3">
            {analyticsData.diseaseRisk.map((disease, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{disease.disease}</span>
                  <span className="font-semibold">{disease.risk}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${disease.risk > 70 ? 'bg-red-500' :
                      disease.risk > 40 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                    style={{ width: `${disease.risk}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">{t.analytics.behaviorAnalysis}</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <TrendingUp className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <p className="font-medium">Improvement</p>
                <p className="text-sm text-gray-600">
                  Average health score increased <strong>12%</strong> this month
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Target className="w-5 h-5 text-blue-500 mt-1" />
              <div>
                <p className="font-medium">Detection</p>
                <p className="text-sm text-gray-600">
                  System detects abnormalities <strong>45%</strong> faster
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
