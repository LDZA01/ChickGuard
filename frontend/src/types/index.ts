// Type definitions for ChickGuard

export interface Farm {
  id: string
  name: string
  location: string
  totalChickens: number
  healthScore: number
  alerts: number
  lastUpdate: string
  temperature: number
  humidity: number
  status: 'healthy' | 'warning' | 'critical'
}

export interface Alert {
  id: string
  farmId: string
  farmName: string
  type: 'info' | 'warning' | 'alert'
  severity: 'low' | 'medium' | 'high'
  message: string
  timestamp: string
  read: boolean
  camera: string
  zone: string
}

export interface Camera {
  id: string
  name: string
  status: 'active' | 'inactive'
  zone: string
  location: string
  lastImage: string
  detections: number
  healthScore: number
}

export interface BehaviorData {
  hour: number
  activity: number
  feeding: number
  resting: number
}

export interface EnvironmentData {
  time: string
  temperature: number
  humidity: number
}

export interface RiskTrend {
  time: string
  risk: number
}

export interface DashboardData {
  farms: Farm[]
  alerts: Alert[]
  totalChickens: number
  averageHealth: number
  activeAlerts: number
  riskTrend: RiskTrend[]
}

export interface FarmDetailData {
  farmId: string
  cameras: Camera[]
  behaviorData: BehaviorData[]
  environmentData: EnvironmentData[]
  currentStats: {
    temperature: number
    humidity: number
    activeChickens: number
    feedingRate: number
    waterConsumption: number
  }
}

export interface HealthTrend {
  date: string
  health: number
  mortality: number
}

export interface BehaviorAnalysis {
  hour: number
  activity: number
  normal: number
  abnormal: number
  alert: number
}

export interface ProductionMetric {
  week: string
  weight: number
  growth: number
  mortality: number
}

export interface DiseaseRisk {
  disease: string
  risk: number
  trend: 'up' | 'down' | 'stable'
}

export interface AnalyticsData {
  healthTrend: HealthTrend[]
  behaviorAnalysis: BehaviorAnalysis[]
  productionMetrics: ProductionMetric[]
  diseaseRisk: DiseaseRisk[]
}

export interface Settings {
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
    alertThreshold: 'low' | 'medium' | 'high'
  }
  monitoring: {
    detectionSensitivity: number
    recordingEnabled: boolean
    motionDetection: boolean
    nightVision: boolean
  }
  alerts: {
    healthScore: number
    temperature: { min: number; max: number }
    humidity: { min: number; max: number }
    abnormalBehavior: boolean
  }
  system: {
    language: string
    timezone: string
    autoBackup: boolean
    dataRetention: number
  }
}
