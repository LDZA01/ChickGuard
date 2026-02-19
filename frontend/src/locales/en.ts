export const en = {
  // Navigation
  nav: {
    dashboard: 'Dashboard',
    analytics: 'Analytics',
    alerts: 'Alerts',
    settings: 'Settings',
  },

  // Dashboard
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Chicken health monitoring system overview',
    totalChickens: 'Total Chickens',
    todayAlerts: "Today's Alerts",
    avgHealthScore: 'Average Health Score',
    totalFarms: 'Total Farms',
    riskTrend: 'Risk Trend',
    allFarms: 'All Farms',
    recentAlerts: 'Recent Alerts',
    viewAll: 'View All',
    loading: 'Loading...',
    chickens: 'Chickens',
    healthScore: 'Health Score',
    status: 'Status',
  },

  // Farm Status
  status: {
    good: 'Normal',
    warning: 'Warning',
    critical: 'Critical',
  },

  // Analytics
  analytics: {
    title: 'Analytics',
    subtitle: 'Data analysis and reports',
    healthTrend: 'Health Trend (7 Days)',
    productionMetrics: 'Production Metrics',
    behaviorAnalysis: 'Behavior Analysis',
    diseaseRisk: 'Disease Risk Assessment',
    weight: 'Weight',
    mortality: 'Mortality',
    feedEfficiency: 'Feed Efficiency',
    eggProduction: 'Egg Production',
    week: 'Week',
    kg: 'kg',
    percent: '%',
    eggs: 'eggs',
  },

  // Alerts
  alerts: {
    title: 'Alerts',
    subtitle: 'Alert history and event management',
    all: 'All',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    searchPlaceholder: 'Search by farm or message...',
    markAsRead: 'Mark as Read',
    noAlerts: 'No alerts found',
  },

  // Farm Detail
  farmDetail: {
    title: 'Farm Detail',
    backToDashboard: 'Back to Dashboard',
    notFound: 'Farm not found',
    cameras: 'Cameras',
    temperature: 'Temperature',
    humidity: 'Humidity',
    cameraStatus: 'Camera Status',
    cameraName: 'Camera',
    location: 'Location',
    activity: 'Activity',
    hourlyActivity: 'Hourly Activity (24h)',
    environment: 'Environment',
    current: 'Current',
  },

  // Settings
  settings: {
    title: 'Settings',
    subtitle: 'System configuration and notifications',
    notifications: 'Notifications',
    email: 'Email',
    sms: 'SMS',
    push: 'Push Notification',
    alertThresholds: 'Alert Thresholds',
    healthScoreBelow: 'Health Score Below',
    minTemperature: 'Minimum Temperature (°C)',
    maxTemperature: 'Maximum Temperature (°C)',
    system: 'System',
    autoBackup: 'Auto Backup',
    dataRetention: 'Data Retention (days)',
    saveSettings: 'Save Settings',
    settingsSaved: '✓ Settings saved successfully',
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    search: 'Search',
    filter: 'Filter',
    active: 'Active',
    inactive: 'Inactive',
    fromYesterday: 'from yesterday',
    safe: 'Safe',
    highRisk: 'High Risk',
  },
}

export type TranslationKeys = typeof en
