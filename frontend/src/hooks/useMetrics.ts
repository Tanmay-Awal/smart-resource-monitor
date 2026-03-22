import { useState, useEffect } from 'react';
import api from '@/lib/api';

export type SystemMetrics = {
  cpu_percent: number;
  ram_percent: number;
  ram_used_gb: number;
  disk_read_mb: number;
  disk_write_mb: number;
  network_sent_mb: number;
  network_recv_mb: number;
  cpu_temp: number | null;
  anomaly: boolean;
  anomaly_message: string | null;
};

export type ProcessInfo = {
  pid: number;
  name: string;
  cpu_percent: number;
  ram_mb: number;
  status: string;
};

export function useMetrics() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial fetch for processes
    const fetchProcesses = async () => {
      try {
        const res = await api.get('/metrics/processes');
        setProcesses(res.data);
      } catch (err) {
        console.error("Error fetching processes:", err);
      }
    };

    fetchProcesses();

    // 2. Connect to WebSocket for real-time metrics
    const ws = new WebSocket('ws://localhost:8000/metrics/ws/metrics');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMetrics(data);
      setLoading(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setLoading(false);
    };

    // 3. Refresh processes every 10 seconds (REST)
    const procInterval = setInterval(fetchProcesses, 10000);

    return () => {
      ws.close();
      clearInterval(procInterval);
    };
  }, []);

  const killProcess = async (pid: number) => {
    try {
      await api.post(`/metrics/autopilot/kill/${pid}`);
      // Refresh list immediately after kill
      const res = await api.get('/metrics/processes');
      setProcesses(res.data);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.detail || "Failed to kill process" };
    }
  };

  return { metrics, processes, loading, killProcess };
}
