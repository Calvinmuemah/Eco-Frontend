// API utility functions
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.ecowatch.example.com';

export interface SensorReading {
  deviceId: string;
  location: {
    lat: number;
    lng: number;
  };
  parameters: {
    temperature: number;
    pH: number;
    turbidity: number;
    dissolvedOxygen: number;
    nitrate: number;
    phosphate: number;
  };
  bloomRisk: 'Low' | 'Medium' | 'High';
  timestamp: string;
}

export interface RealtimeMetricsResponse {
  success: boolean;
  count: number;
  data: SensorReading[];
  ai_analysis: string;
}

export const api = {
  // Sensor Data
  async getRealtimeMetrics(): Promise<RealtimeMetricsResponse> {
    const response = await fetch(`${API_BASE_URL}/api/sensor-data/realtime-metrics`);
    return response.json();
  },

  async getSensorData(deviceId: string) {
    const response = await fetch(`${API_BASE_URL}/api/sensor-data/${deviceId}`);
    return response.json();
  },

  async getSensorHistory(deviceId: string, hours: number = 24) {
    const response = await fetch(`${API_BASE_URL}/api/sensor-data/${deviceId}/history?hours=${hours}`);
    return response.json();
  },

  // Analysis
  async getAnalysisSummary(parameters: any) {
    const response = await fetch(`${API_BASE_URL}/api/analysis/summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parameters }),
    });
    return response.json();
  },

  // Discharge Events
  async getDischargeEvents(from?: string, to?: string, severity?: string) {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (severity) params.append('severity', severity);
    
    const response = await fetch(`${API_BASE_URL}/api/discharge/events?${params}`);
    return response.json();
  },

  // Chatbot
  async sendChatMessage(sessionId: string, message: string) {
    const response = await fetch(`${API_BASE_URL}/api/chatbot/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, message }),
    });
    return response.json();
  },
};

// Mock data for development
export const mockSensorData: SensorReading = {
  deviceId: 'sensor-01',
  location: { lat: -1.286, lng: 36.817 },
  parameters: {
    temperature: 28,
    pH: 8.4,
    turbidity: 65,
    dissolvedOxygen: 3.5,
    nitrate: 12,
    phosphate: 0.15,
  },
  bloomRisk: 'High',
  timestamp: new Date().toISOString(),
};
