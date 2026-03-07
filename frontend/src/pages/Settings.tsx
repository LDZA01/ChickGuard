import { useState, useEffect } from 'react'
import { Save, Bell, Shield, Database } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import type { Settings as SettingsType } from '../types'
import api from '../services/api'

export default function Settings() {
  const [settings, setSettings] = useState<SettingsType | null>(null)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true)
      const { data, error } = await api.getSettings()
      if (!error && data) {
        setSettings(data)
      }
      setLoading(false)
    }
    fetchSettings()
  }, [])

  const handleSave = () => {
    console.log('Saving settings:', settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

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

  if (!settings) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t.settings.title}</h1>
        <p className="text-gray-600 mt-1">{t.settings.subtitle}</p>
      </div>

      {/* Notifications */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <Bell className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold">{t.settings.notifications}</h2>
        </div>
        <div className="space-y-4">
          {[
            { key: 'email', label: t.settings.email },
            { key: 'sms', label: t.settings.sms },
            { key: 'push', label: t.settings.push },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="font-medium">{label}</span>
              <button
                onClick={() => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, [key]: !settings.notifications[key as keyof typeof settings.notifications] }
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${settings.notifications[key as keyof typeof settings.notifications] ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
              >
                <span className={`inline-block h-4 w-4 rounded-full bg-white transform transition ${settings.notifications[key as keyof typeof settings.notifications] ? 'translate-x-6' : 'translate-x-1'
                  }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Thresholds */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold">{t.settings.alertThresholds}</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t.settings.healthScoreBelow}</label>
            <input
              type="number"
              value={settings.alerts.healthScore}
              onChange={(e) => setSettings({
                ...settings,
                alerts: { ...settings.alerts, healthScore: parseInt(e.target.value) }
              })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t.settings.minTemperature}</label>
              <input
                type="number"
                value={settings.alerts.temperature.min}
                onChange={(e) => setSettings({
                  ...settings,
                  alerts: { ...settings.alerts, temperature: { ...settings.alerts.temperature, min: parseInt(e.target.value) } }
                })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t.settings.maxTemperature}</label>
              <input
                type="number"
                value={settings.alerts.temperature.max}
                onChange={(e) => setSettings({
                  ...settings,
                  alerts: { ...settings.alerts, temperature: { ...settings.alerts.temperature, max: parseInt(e.target.value) } }
                })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* System */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <Database className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold">{t.settings.system}</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">{t.settings.autoBackup}</span>
            <button
              onClick={() => setSettings({
                ...settings,
                system: { ...settings.system, autoBackup: !settings.system.autoBackup }
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${settings.system.autoBackup ? 'bg-primary-600' : 'bg-gray-300'
                }`}
            >
              <span className={`inline-block h-4 w-4 rounded-full bg-white transform transition ${settings.system.autoBackup ? 'translate-x-6' : 'translate-x-1'
                }`} />
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t.settings.dataRetention}</label>
            <input
              type="number"
              value={settings.system.dataRetention}
              onChange={(e) => setSettings({
                ...settings,
                system: { ...settings.system, dataRetention: parseInt(e.target.value) }
              })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Save className="w-5 h-5" />
          <span>{t.settings.saveSettings}</span>
        </button>
      </div>

      {saved && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {t.settings.settingsSaved}
        </div>
      )}
    </div>
  )
}
