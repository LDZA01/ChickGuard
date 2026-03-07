import { Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import FarmDetail from './pages/FarmDetail'
import Analytics from './pages/Analytics'
import Alerts from './pages/Alerts'
import Settings from './pages/Settings'
import BackendStatus from './pages/BackendStatus'
import VetConnect from './pages/VetConnect'

function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/backend" element={<BackendStatus />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/farm/:id" element={<FarmDetail />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/vet" element={<VetConnect />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </LanguageProvider>
  )
}

export default App
