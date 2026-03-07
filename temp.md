import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Camera, 
  Thermometer, 
  Droplets, 
  Wind, 
  AlertTriangle, 
  Settings, 
  Activity, 
  Zap, 
  CloudRain,
  PieChart as PieChartIcon,
  ChevronRight,
  RefreshCw,
  Bell,
  Cpu
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// --- Constants & Mock Data ---
const CHICKEN_COUNT = 8;
const INITIAL_LOGS = [
  { id: 1, time: '10:45 AM', type: 'info', msg: 'Automatic feeder dispensed 500g.' },
  { id: 2, time: '10:12 AM', type: 'warning', msg: 'High Ammonia (NH3) detected in South Corner.' },
  { id: 3, time: '09:30 AM', type: 'success', msg: 'Morning health check: 100% active.' },
];

const App = () => {
  // --- State ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [sensors, setSensors] = useState({ temp: 24.5, humidity: 62, ammonia: 12 });
  const [controls, setControls] = useState({ lights: true, fan: false, feeder: false });
  const [history, setHistory] = useState([]);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [chickenPositions, setChickenPositions] = useState([]);

  // --- Mock Sensor & Movement Logic ---
  useEffect(() => {
    // Generate initial history
    const initialHistory = Array.from({ length: 20 }, (_, i) => ({
      time: `${10 - Math.floor(i/2)}:${(i % 2) * 30}`,
      temp: 22 + Math.random() * 5,
      humidity: 55 + Math.random() * 15,
      ammonia: 5 + Math.random() * 10,
    })).reverse();
    setHistory(initialHistory);

    // Initialize chicken positions for the "camera"
    const initialPos = Array.from({ length: CHICKEN_COUNT }, () => ({
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
      id: Math.random().toString(36).substr(2, 5),
      confidence: 0.85 + Math.random() * 0.12
    }));
    setChickenPositions(initialPos);

    // Update sensors and movement every 3 seconds
    const interval = setInterval(() => {
      setSensors(prev => ({
        temp: Math.min(35, Math.max(15, prev.temp + (Math.random() - 0.5))),
        humidity: Math.min(90, Math.max(40, prev.humidity + (Math.random() - 0.5) * 2)),
        ammonia: Math.min(50, Math.max(0, prev.ammonia + (Math.random() - 0.5) * 3))
      }));

      setChickenPositions(prev => prev.map(c => ({
        ...c,
        x: Math.min(90, Math.max(5, c.x + (Math.random() - 0.5) * 4)),
        y: Math.min(85, Math.max(15, c.y + (Math.random() - 0.5) * 4)),
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // --- Handlers ---
  const toggleControl = (key) => setControls(prev => ({ ...prev, [key]: !prev[key] }));

  const runDiagnosis = async () => {
    setIsDiagnosing(true);
    setDiagnosisResult(null);

    // Simulate API Call to Gemini 2.5 Flash
    setTimeout(() => {
      const results = [
        "Optimal welfare. High activity levels observed. No respiratory distress sounds detected.",
        "Slight lethargy in Subject #4. Recommend checking hydration levels in the West sector.",
        "Environmental stress detected: High NH3 levels are causing reduced foraging behavior.",
        "Egg production peak: 3 new eggs detected in nesting boxes via visual analysis."
      ];
      setDiagnosisResult(results[Math.floor(Math.random() * results.length)]);
      setIsDiagnosing(false);
      
      const newLog = { 
        id: Date.now(), 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
        type: 'info', 
        msg: 'AI Health Scan completed.' 
      };
      setLogs(prev => [newLog, ...prev.slice(0, 4)]);
    }, 2500);
  };

  // --- UI Components ---
  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-colors ${
        activeTab === id ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-500 hover:bg-orange-50'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col hidden md:flex">
        <div className="flex items-center space-x-3 mb-10">
          <div className="bg-orange-500 p-2 rounded-lg text-white">
            <Activity size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">CluckWatch AI</h1>
        </div>

        <nav className="space-y-2 flex-grow">
          <SidebarItem id="dashboard" icon={PieChartIcon} label="Main Dashboard" />
          <SidebarItem id="camera" icon={Camera} label="Live Streams" />
          <SidebarItem id="sensors" icon={Activity} label="Sensor Data" />
          <SidebarItem id="settings" icon={Settings} label="System Config" />
        </nav>

        <div className="bg-orange-50 p-4 rounded-2xl">
          <div className="flex items-center space-x-2 text-orange-600 mb-2">
            <Zap size={16} fill="currentColor" />
            <span className="text-sm font-bold uppercase tracking-wider">Premium Cloud</span>
          </div>
          <p className="text-xs text-orange-800 leading-relaxed">
            Multiplayer sharing and unlimited cloud storage enabled.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold capitalize">{activeTab}</h2>
            <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              SYSTEM ONLINE
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300" />
          </div>
        </header>

        {/* Scrollable View */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Live Camera View */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative group aspect-video border-4 border-white">
                {/* Simulated Camera Feed */}
                <div className="absolute inset-0 bg-[#1e2a1e] flex items-center justify-center opacity-80">
                   {/* Grid Pattern */}
                   <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px'}} />
                </div>

                {/* Chickens (SVG/Emoji) */}
                {chickenPositions.map((c) => (
                  <div 
                    key={c.id}
                    className="absolute transition-all duration-1000 ease-in-out pointer-events-none"
                    style={{ left: `${c.x}%`, top: `${c.y}%` }}
                  >
                    {/* Bounding Box Simulation */}
                    <div className="border border-green-400/60 bg-green-400/5 p-1 rounded">
                      <div className="text-[10px] text-green-400 font-mono -mt-5 bg-black/50 px-1">
                        鶏 Chicken {Math.floor(c.confidence * 100)}%
                      </div>
                      <span className="text-3xl filter drop-shadow-lg">🐔</span>
                    </div>
                  </div>
                ))}

                {/* Overlays */}
                <div className="absolute top-4 left-4 flex items-center space-x-3 text-white">
                  <div className="bg-red-600 px-2 py-1 rounded text-[10px] font-bold animate-pulse">REC</div>
                  <div className="text-xs font-mono opacity-80">{new Date().toLocaleTimeString()}</div>
                </div>

                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 rounded-lg text-white">
                    <RefreshCw size={18} />
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 rounded-lg text-white">
                    <Camera size={18} />
                  </button>
                </div>
              </div>

              {/* AI Diagnostic Section */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Cpu className="text-orange-500" size={24} />
                    <h3 className="font-bold text-lg">Gemini Health Diagnostic</h3>
                  </div>
                  <button 
                    onClick={runDiagnosis}
                    disabled={isDiagnosing}
                    className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 hover:bg-slate-800 disabled:opacity-50 transition-all"
                  >
                    {isDiagnosing ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} />}
                    <span>{isDiagnosing ? 'Analyzing...' : 'Run Full Scan'}</span>
                  </button>
                </div>
                
                {diagnosisResult ? (
                  <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-start space-x-3">
                      <div className="bg-orange-500 p-1.5 rounded-lg text-white mt-0.5">
                        <Activity size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-orange-900 mb-1">AI Health Assessment</p>
                        <p className="text-sm text-orange-800 leading-relaxed italic">"{diagnosisResult}"</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-100 p-8 rounded-2xl flex flex-col items-center justify-center text-slate-400">
                    <p className="text-sm">Click 'Run Full Scan' to analyze live visual & sensor data</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Controls & Stats */}
            <div className="space-y-6">
              
              {/* Sensors Grid */}
              <div className="grid grid-cols-1 gap-4">
                <SensorCard 
                  icon={Thermometer} 
                  label="Temperature" 
                  value={`${sensors.temp.toFixed(1)}°C`} 
                  color="text-orange-500" 
                  bg="bg-orange-50"
                  trend={sensors.temp > 28 ? 'Critical High' : 'Normal'}
                />
                <SensorCard 
                  icon={Droplets} 
                  label="Humidity" 
                  value={`${sensors.humidity.toFixed(0)}%`} 
                  color="text-blue-500" 
                  bg="bg-blue-50"
                  trend="Stable"
                />
                <SensorCard 
                  icon={Wind} 
                  label="Ammonia" 
                  value={`${sensors.ammonia.toFixed(1)} ppm`} 
                  color="text-emerald-500" 
                  bg="bg-emerald-50"
                  trend={sensors.ammonia > 25 ? 'Danger' : 'Healthy'}
                />
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <h3 className="font-bold mb-4 text-slate-800">Quick Controls</h3>
                <div className="space-y-3">
                  <ControlToggle 
                    label="Coop Lighting" 
                    active={controls.lights} 
                    onClick={() => toggleControl('lights')} 
                    icon={Zap}
                  />
                  <ControlToggle 
                    label="Exhaust Fan" 
                    active={controls.fan} 
                    onClick={() => toggleControl('fan')} 
                    icon={Wind}
                  />
                  <ControlToggle 
                    label="Smart Feeder" 
                    active={controls.feeder} 
                    onClick={() => toggleControl('feeder')} 
                    icon={PieChartIcon}
                  />
                </div>
              </div>

              {/* Event Logs */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 h-64 flex flex-col">
                <h3 className="font-bold mb-4 text-slate-800">Activity Log</h3>
                <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                  {logs.map(log => (
                    <div key={log.id} className="flex items-start space-x-3">
                      <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                        log.type === 'warning' ? 'bg-amber-500' : log.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-xs text-slate-400 font-medium">{log.time}</p>
                        <p className="text-sm text-slate-600 font-medium leading-tight">{log.msg}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Environmental Chart Area */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Environmental Analytics</h3>
                <p className="text-sm text-slate-500">24-hour historical trend of coop conditions</p>
              </div>
              <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg">
                <button className="px-3 py-1 text-xs font-bold bg-white shadow-sm rounded-md">Live</button>
                <button className="px-3 py-1 text-xs font-bold text-slate-400">1D</button>
                <button className="px-3 py-1 text-xs font-bold text-slate-400">1W</button>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="temp" stroke="#f97316" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={3} />
                  <Area type="monotone" dataKey="humidity" stroke="#3b82f6" fillOpacity={1} fill="url(#colorHum)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

// --- Helper Components ---

const SensorCard = ({ icon: Icon, label, value, color, bg, trend }) => (
  <div className={`p-5 rounded-3xl shadow-sm border border-slate-200 bg-white flex items-center justify-between`}>
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-2xl ${bg} ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-slate-800 tracking-tight">{value}</p>
      </div>
    </div>
    <div className="text-right">
      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
        trend === 'Stable' || trend === 'Normal' || trend === 'Healthy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}>
        {trend}
      </span>
    </div>
  </div>
);

const ControlToggle = ({ label, active, onClick, icon: Icon }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${
      active ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
    }`}
  >
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-lg ${active ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <Icon size={18} />
      </div>
      <span className="font-bold text-sm">{label}</span>
    </div>
    <div className={`w-10 h-5 rounded-full relative transition-colors ${active ? 'bg-green-500' : 'bg-slate-300'}`}>
      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${active ? 'left-6' : 'left-1'}`} />
    </div>
  </button>
);

export default App;