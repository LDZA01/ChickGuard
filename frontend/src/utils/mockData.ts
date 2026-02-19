import type {
  DashboardData,
  FarmDetailData,
  AnalyticsData,
  Farm,
  Alert,
  Camera,
  BehaviorData,
  Settings
} from '../types';

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomFloat = (min: number, max: number, decimals: number = 2): number => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
};

export const generateMockData = (): DashboardData => {
  const farms: Farm[] = [
    {
      id: '1',
      name: 'ฟาร์มไก่สุขภาพดี 1',
      location: 'นครปฐม',
      totalChickens: 5000,
      healthScore: randomInt(85, 98),
      alerts: randomInt(0, 5),
      lastUpdate: new Date(Date.now() - randomInt(0, 3600000)).toISOString(),
      temperature: randomFloat(28, 32),
      humidity: randomFloat(60, 75),
      status: Math.random() > 0.2 ? 'healthy' : 'warning'
    },
    {
      id: '2',
      name: 'ฟาร์มไก่สุขภาพดี 2',
      location: 'สุพรรณบุรี',
      totalChickens: 3500,
      healthScore: randomInt(85, 98),
      alerts: randomInt(0, 5),
      lastUpdate: new Date(Date.now() - randomInt(0, 3600000)).toISOString(),
      temperature: randomFloat(28, 32),
      humidity: randomFloat(60, 75),
      status: Math.random() > 0.2 ? 'healthy' : 'warning'
    },
    {
      id: '3',
      name: 'ฟาร์มไก่สุขภาพดี 3',
      location: 'ราชบุรี',
      totalChickens: 4200,
      healthScore: randomInt(85, 98),
      alerts: randomInt(0, 5),
      lastUpdate: new Date(Date.now() - randomInt(0, 3600000)).toISOString(),
      temperature: randomFloat(28, 32),
      humidity: randomFloat(60, 75),
      status: Math.random() > 0.2 ? 'healthy' : 'warning'
    }
  ];

  const alerts: Alert[] = [
    {
      id: '1',
      farmId: '1',
      farmName: 'ฟาร์มไก่สุขภาพดี 1',
      type: 'warning',
      severity: 'medium',
      message: 'ตรวจพบพฤติกรรมผิดปกติในโซน A',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      read: false,
      camera: 'CAM-01',
      zone: 'A'
    },
    {
      id: '2',
      farmId: '2',
      farmName: 'ฟาร์มไก่สุขภาพดี 2',
      type: 'alert',
      severity: 'high',
      message: 'อุณหภูมิสูงกว่าปกติในโรงเรือน B',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
      camera: 'CAM-05',
      zone: 'B'
    },
    {
      id: '3',
      farmId: '1',
      farmName: 'ฟาร์มไก่สุขภาพดี 1',
      type: 'info',
      severity: 'low',
      message: 'ระบบทำความสะอาดอัตโนมัติเสร็จสมบูรณ์',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: true,
      camera: 'CAM-02',
      zone: 'A'
    }
  ];

  const riskTrend = Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    risk: randomInt(10, 40)
  }));

  return {
    farms,
    alerts,
    totalChickens: farms.reduce((sum, farm) => sum + farm.totalChickens, 0),
    averageHealth: parseFloat(
      (farms.reduce((sum, farm) => sum + farm.healthScore, 0) / farms.length).toFixed(1)
    ),
    activeAlerts: alerts.filter(a => !a.read).length,
    riskTrend
  };
};

export const generateFarmDetailData = (farmId: string): FarmDetailData => {
  const cameras: Camera[] = [
    {
      id: 'CAM-01',
      name: 'กล้องโซน A',
      status: 'active',
      zone: 'A',
      location: 'Zone A - North Wing',
      lastImage: '/api/placeholder/640/480',
      detections: randomInt(50, 150),
      healthScore: randomInt(85, 98)
    },
    {
      id: 'CAM-02',
      name: 'กล้องโซน B',
      status: 'active',
      zone: 'B',
      location: 'Zone B - East Wing',
      lastImage: '/api/placeholder/640/480',
      detections: randomInt(50, 150),
      healthScore: randomInt(85, 98)
    },
    {
      id: 'CAM-03',
      name: 'กล้องโซน C',
      status: 'inactive',
      zone: 'C',
      location: 'Zone C - South Wing',
      lastImage: '/api/placeholder/640/480',
      detections: 0,
      healthScore: 0
    },
    {
      id: 'CAM-04',
      name: 'กล้องโซน D',
      status: 'active',
      zone: 'D',
      location: 'Zone D - West Wing',
      lastImage: '/api/placeholder/640/480',
      detections: randomInt(50, 150),
      healthScore: randomInt(85, 98)
    }
  ];

  const behaviorData: BehaviorData[] = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    activity: randomInt(40, 100),
    feeding: randomInt(20, 80),
    resting: randomInt(10, 60)
  }));

  const environmentData = Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    temperature: randomFloat(26, 34),
    humidity: randomFloat(55, 80)
  }));

  return {
    farmId,
    cameras,
    behaviorData,
    environmentData,
    currentStats: {
      temperature: randomFloat(28, 32),
      humidity: randomFloat(60, 75),
      activeChickens: randomInt(4500, 5000),
      feedingRate: randomInt(60, 95),
      waterConsumption: randomInt(200, 300)
    }
  };
};

export const generateAnalyticsData = (): AnalyticsData => {
  const healthTrend = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
    health: randomInt(85, 98),
    mortality: randomFloat(0, 2)
  }));

  const behaviorAnalysis = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    activity: randomInt(30, 100),
    normal: randomInt(80, 95),
    abnormal: randomInt(2, 10),
    alert: randomInt(1, 5)
  }));

  const productionMetrics = Array.from({ length: 7 }, (_, i) => ({
    week: `สัปดาห์ ${i + 1}`,
    weight: randomFloat(1.2, 2.5),
    growth: randomFloat(5, 15),
    mortality: randomFloat(0.5, 3)
  }));

  const diseaseRisk = [
    { disease: 'ไข้หวัดนก', risk: randomInt(5, 25), trend: 'down' as const },
    { disease: 'โรคนิวคาสเซิล', risk: randomInt(5, 25), trend: 'stable' as const },
    { disease: 'โคไซดิโอซิส', risk: randomInt(5, 25), trend: 'up' as const },
    { disease: 'โรคติดเชื้ออื่นๆ', risk: randomInt(5, 25), trend: 'stable' as const }
  ];

  return {
    healthTrend,
    behaviorAnalysis,
    productionMetrics,
    diseaseRisk
  };
};

export const generateSettings = (): Settings => {
  return {
    notifications: {
      email: true,
      sms: false,
      push: true,
      alertThreshold: 'medium'
    },
    monitoring: {
      detectionSensitivity: 75,
      recordingEnabled: true,
      motionDetection: true,
      nightVision: true
    },
    alerts: {
      healthScore: 80,
      temperature: { min: 26, max: 34 },
      humidity: { min: 55, max: 80 },
      abnormalBehavior: true
    },
    system: {
      language: 'th',
      timezone: 'Asia/Bangkok',
      autoBackup: true,
      dataRetention: 90
    }
  };
};
