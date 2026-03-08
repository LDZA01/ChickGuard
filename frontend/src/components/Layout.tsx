import { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Activity, 
  Bell, 
  Settings, 
  Menu,
  X,
  Stethoscope,
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'

const navigation = [
  { name: 'dashboard',  href: '/',          icon: LayoutDashboard },
  { name: 'analytics',  href: '/analytics', icon: Activity },
  { name: 'alerts',     href: '/alerts',    icon: Bell },
  { name: 'vetConnect', href: '/vet',        icon: Stethoscope },
  { name: 'settings',   href: '/settings',  icon: Settings },
]

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="ChickGuard Logo" className="w-10 h-10 object-contain" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">ChickGuard</h1>
                <p className="text-xs text-gray-500">AI Health Monitoring</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-4">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{t.nav[item.name as keyof typeof t.nav]}</span>
                  </Link>
                )
              })}
            </nav>

            {/* User Menu & Language Switcher */}
            <div className="hidden md:flex items-center space-x-4">
              <LanguageSwitcher />
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                F
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <nav className="px-4 py-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{t.nav[item.name as keyof typeof t.nav]}</span>
                  </Link>
                )
              })}
              <div className="px-3 py-2">
                <LanguageSwitcher />
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>© 2026 ChickGuard - Made with ❤️ for Thai Farmers</p>
            <p className="mt-1">AI-Powered Smart Farming Innovation</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
