import type { TranslationKeys } from './en'

export const th: TranslationKeys = {
  // Navigation
  nav: {
    dashboard: 'แดชบอร์ด',
    analytics: 'วิเคราะห์',
    alerts: 'แจ้งเตือน',
    settings: 'ตั้งค่า',
  },

  // Dashboard
  dashboard: {
    title: 'แดชบอร์ด',
    subtitle: 'ภาพรวมระบบตรวจสอบสุขภาพไก่',
    totalChickens: 'จำนวนไก่ทั้งหมด',
    todayAlerts: 'แจ้งเตือนวันนี้',
    avgHealthScore: 'คะแนนสุขภาพเฉลี่ย',
    totalFarms: 'จำนวนฟาร์ม',
    riskTrend: 'แนวโน้มความเสี่ยง',
    allFarms: 'ฟาร์มทั้งหมด',
    recentAlerts: 'การแจ้งเตือนล่าสุด',
    viewAll: 'ดูทั้งหมด',
    loading: 'กำลังโหลด...',
    chickens: 'ไก่',
    healthScore: 'คะแนนสุขภาพ',
    status: 'สถานะ',
  },

  // Farm Status
  status: {
    good: 'ปกติ',
    warning: 'เฝ้าระวัง',
    critical: 'วิกฤต',
  },

  // Analytics
  analytics: {
    title: 'วิเคราะห์ข้อมูล',
    subtitle: 'การวิเคราะห์และรายงานข้อมูล',
    healthTrend: 'แนวโน้มสุขภาพ (7 วัน)',
    productionMetrics: 'ตัวชี้วัดการผลิต',
    behaviorAnalysis: 'วิเคราะห์พฤติกรรม',
    diseaseRisk: 'ประเมินความเสี่ยงโรค',
    weight: 'น้ำหนัก',
    mortality: 'อัตราการตาย',
    feedEfficiency: 'ประสิทธิภาพอาหาร',
    eggProduction: 'การผลิตไข่',
    week: 'สัปดาห์',
    kg: 'กก.',
    percent: '%',
    eggs: 'ฟอง',
  },

  // Alerts
  alerts: {
    title: 'การแจ้งเตือน',
    subtitle: 'ประวัติการแจ้งเตือนและการจัดการเหตุการณ์',
    all: 'ทั้งหมด',
    high: 'สูง',
    medium: 'ปานกลาง',
    low: 'ต่ำ',
    searchPlaceholder: 'ค้นหาตามฟาร์มหรือข้อความ...',
    markAsRead: 'ทำเครื่องหมายว่าอ่านแล้ว',
    noAlerts: 'ไม่พบการแจ้งเตือน',
  },

  // Farm Detail
  farmDetail: {
    title: 'รายละเอียดฟาร์ม',
    backToDashboard: 'กลับสู่แดชบอร์ด',
    notFound: 'ไม่พบข้อมูลฟาร์ม',
    cameras: 'กล้อง',
    temperature: 'อุณหภูมิ',
    humidity: 'ความชื้น',
    cameraStatus: 'สถานะกล้อง',
    cameraName: 'กล้อง',
    location: 'ตำแหน่ง',
    activity: 'กิจกรรม',
    hourlyActivity: 'กิจกรรมแต่ละชั่วโมง (24 ชม.)',
    environment: 'สภาพแวดล้อม',
    current: 'ปัจจุบัน',
  },

  // Settings
  settings: {
    title: 'ตั้งค่า',
    subtitle: 'จัดการการตั้งค่าระบบและการแจ้งเตือน',
    notifications: 'การแจ้งเตือน',
    email: 'อีเมล',
    sms: 'SMS',
    push: 'Push Notification',
    alertThresholds: 'ค่าเกณฑ์การแจ้งเตือน',
    healthScoreBelow: 'คะแนนสุขภาพต่ำกว่า',
    minTemperature: 'อุณหภูมิต่ำสุด (°C)',
    maxTemperature: 'อุณหภูมิสูงสุด (°C)',
    system: 'ระบบ',
    autoBackup: 'สำรองข้อมูลอัตโนมัติ',
    dataRetention: 'ระยะเวลาเก็บข้อมูล (วัน)',
    saveSettings: 'บันทึกการตั้งค่า',
    settingsSaved: '✓ บันทึกการตั้งค่าเรียบร้อยแล้ว',
  },

  // Common
  common: {
    loading: 'กำลังโหลด...',
    error: 'เกิดข้อผิดพลาด',
    success: 'สำเร็จ',
    save: 'บันทึก',
    cancel: 'ยกเลิก',
    edit: 'แก้ไข',
    delete: 'ลบ',
    search: 'ค้นหา',
    filter: 'กรอง',
    active: 'ใช้งาน',
    inactive: 'ไม่ใช้งาน',
    fromYesterday: 'จากเมื่อวาน',
    safe: 'ปลอดภัย',
    highRisk: 'เสี่ยงสูง',
  },
}
