/**
 * API Service for ChickGuard Backend
 * Connects to FastAPI backend at localhost:8000
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ApiResponse<T> {
  data: T;
  error?: string;
}

/**
 * Fetch wrapper with error handling
 */
async function fetchAPI<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    return { 
      data: {} as T, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * API Service
 */
export const api = {
  /**
   * Get live detection data from backend
   */
  async getDetectionLive() {
    return fetchAPI<any>('/api/detection/live');
  },

  /**
   * Get dashboard data
   */
  async getDashboard() {
    return fetchAPI<any>('/api/dashboard');
  },

  /**
   * Get system statistics
   */
  async getStats() {
    return fetchAPI<any>('/api/stats');
  },

  /**
   * Get current risk analysis
   */
  async getRiskCurrent(farmId: number = 1) {
    return fetchAPI<any>(`/api/risk/current?farm_id=${farmId}`);
  },

  /**
   * Get analytics data
   */
  async getAnalytics() {
    return fetchAPI<any>('/api/analytics');
  },

  /**
   * Get farm details by ID
   */
  async getFarmDetail(farmId: string) {
    return fetchAPI<any>(`/api/farm/${farmId}`);
  },

  /**
   * Get settings
   */
  async getSettings() {
    return fetchAPI<any>('/api/settings');
  },

  /**
   * Get risk trend over time
   */
  async getRiskTrend() {
    return fetchAPI<any>('/api/risk/trend');
  },

  /**
   * Check if backend is available
   */
  async healthCheck() {
    return fetchAPI<any>('/');
  },

  /**
   * Get video feed URL
   */
  getVideoFeedUrl(farmId: number = 1) {
    return `${API_BASE_URL}/api/video_feed?farm_id=${farmId}`;
  }
};

/**
 * WebSocket connection for real-time updates
 */
export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectInterval: number = 5000;
  private reconnectTimer?: number;

  constructor(endpoint: string = '/ws/live') {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const baseUrl = API_BASE_URL.replace(/^https?:/, wsProtocol);
    this.url = `${baseUrl}${endpoint}`;
  }

  connect(onMessage: (data: any) => void) {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('✅ WebSocket connected');
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('WebSocket message parse error:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('🔌 WebSocket disconnected, reconnecting...');
        this.reconnect(onMessage);
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.reconnect(onMessage);
    }
  }

  private reconnect(onMessage: (data: any) => void) {
    this.reconnectTimer = window.setTimeout(() => {
      console.log('🔄 Attempting to reconnect...');
      this.connect(onMessage);
    }, this.reconnectInterval);
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
}

export default api;
