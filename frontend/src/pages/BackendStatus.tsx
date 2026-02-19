import { useState, useEffect } from 'react'
import { Activity, Wifi, WifiOff, Video } from 'lucide-react'

const API_URL = 'http://localhost:8000'

export default function BackendStatus() {
  const [connected, setConnected] = useState(false)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(`${API_URL}/api/detection/live`)
        const json = await response.json()
        
        setConnected(true)
        setData(json)
        console.log('✅ Backend connected:', json)
      } catch (error) {
        setConnected(false)
        console.warn('⚠️  Backend not available')
      } finally {
        setLoading(false)
      }
    }

    checkBackend()
    const interval = setInterval(checkBackend, 3000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🐔 ChickGuard
          </h1>
          <p className="text-xl text-gray-600">
            AI-Powered Monitoring System
          </p>
        </div>

        {/* Connection Status */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Backend Connection
            </h2>
            {loading ? (
              <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : connected ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full">
                <Wifi className="w-5 h-5" />
                <span className="font-medium">Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full">
                <WifiOff className="w-5 h-5" />
                <span className="font-medium">Disconnected</span>
              </div>
            )}
          </div>

          {connected && data ? (
            <div className="space-y-6">
              {/* Real-time Data */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="w-8 h-8 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Objects
                    </h3>
                  </div>
                  <p className="text-4xl font-bold text-blue-600">
                    {data.detection?.total_objects || 0}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Detected</p>
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Video className="w-8 h-8 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      FPS
                    </h3>
                  </div>
                  <p className="text-4xl font-bold text-green-600">
                    {data.detection?.processing_fps?.toFixed(1) || '0.0'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Frames/sec</p>
                </div>

                <div className="bg-purple-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="w-8 h-8 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Activity
                    </h3>
                  </div>
                  <p className="text-4xl font-bold text-purple-600">
                    {data.detection?.activity_level || 0}%
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Level</p>
                </div>
              </div>

              {/* Detection Data */}
              {data.detection?.detections && data.detection.detections.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Latest Detections
                  </h3>
                  <div className="space-y-2">
                    {data.detection.detections.slice(0, 5).map((det: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between bg-white px-4 py-3 rounded-lg">
                        <span className="font-medium text-gray-900">
                          {det.class}
                        </span>
                        <span className="text-sm text-gray-600">
                          Confidence: {(det.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video Feed Link */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">
                  Live Video Feed
                </h3>
                <p className="text-sm text-blue-100 mb-4">
                  View real-time AI detection with bounding boxes
                </p>
                <a
                  href={`${API_URL}/api/video_feed`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
                >
                  <Video className="w-5 h-5" />
                  Open Video Feed
                </a>
              </div>

              {/* Raw Data */}
              <details className="bg-gray-50 rounded-xl p-6">
                <summary className="cursor-pointer font-semibold text-gray-900 mb-2">
                  Raw API Response
                </summary>
                <pre className="text-xs bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </details>
            </div>
          ) : !loading && !connected ? (
            <div className="text-center py-12">
              <WifiOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Backend Not Running
              </h3>
              <p className="text-gray-600 mb-6">
                Start the backend server to see live AI detection
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-left max-w-md mx-auto">
                <p className="text-sm font-mono text-gray-700 mb-2">
                  cd backend
                </p>
                <p className="text-sm font-mono text-gray-700">
                  python main.py
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* API Endpoints */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            API Endpoints
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { path: '/', label: 'API Info' },
              { path: '/api/detection/live', label: 'Live Detection' },
              { path: '/api/dashboard', label: 'Dashboard Data' },
              { path: '/api/stats', label: 'Statistics' },
              { path: '/api/video_feed', label: 'Video Stream' },
              { path: '/docs', label: 'API Docs' }
            ].map((endpoint) => (
              <a
                key={endpoint.path}
                href={`${API_URL}${endpoint.path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-lg transition"
              >
                <span className="font-medium text-gray-900">
                  {endpoint.label}
                </span>
                <span className="text-xs text-gray-500 font-mono">
                  {endpoint.path}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600">
          <p>Frontend: React 18 + TypeScript + Vite</p>
          <p>Backend: FastAPI + YOLOv8 + OpenCV</p>
          <p className="mt-2 text-sm">
            Backend URL: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{API_URL}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
