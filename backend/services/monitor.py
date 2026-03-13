import psutil
import datetime
from collections import deque, defaultdict
from statistics import mean, stdev

# History buffers for anomaly detection
cpu_history = deque(maxlen=60)
ram_history = deque(maxlen=60)
temp_history = deque(maxlen=30)

# Pattern learning
hourly_cpu = defaultdict(list)
hourly_ram = defaultdict(list)

def get_system_metrics():
    """Get current system metrics"""
    cpu = psutil.cpu_percent(interval=0.5)
    ram = psutil.virtual_memory()
    disk = psutil.disk_io_counters()
    net = psutil.net_io_counters()

    try:
        temps = psutil.sensors_temperatures()
        cpu_temp = list(temps.values())[0][0].current if temps else None
    except:
        cpu_temp = None

    return {
        "time": datetime.datetime.utcnow().isoformat(),
        "cpu_percent": round(cpu, 1),
        "ram_used_gb": round(ram.used / (1024**3), 2),
        "ram_percent": round(ram.percent, 1),
        "disk_read_mb": round(disk.read_bytes / (1024**2), 2),
        "disk_write_mb": round(disk.write_bytes / (1024**2), 2),
        "network_sent_mb": round(net.bytes_sent / (1024**2), 2),
        "network_recv_mb": round(net.bytes_recv / (1024**2), 2),
        "cpu_temp": round(cpu_temp, 1) if cpu_temp else None
    }

def get_process_list():
    """Get top processes by CPU usage"""
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_info', 'status']):
        try:
            processes.append({
                "pid": proc.info['pid'],
                "name": proc.info['name'],
                "cpu_percent": round(proc.info['cpu_percent'], 1),
                "ram_mb": round(proc.info['memory_info'].rss / (1024**2), 2),
                "status": proc.info['status']
            })
        except:
            pass
    return sorted(processes, key=lambda x: x['cpu_percent'], reverse=True)[:20]

def check_anomaly(cpu, ram):
    """Detect anomalies using statistical analysis"""
    cpu_history.append(cpu)
    ram_history.append(ram)

    if len(cpu_history) < 20:
        return False, None

    try:
        cpu_mean = mean(list(cpu_history))
        cpu_std = stdev(list(cpu_history)) if len(cpu_history) > 1 else 0
        ram_mean = mean(list(ram_history))
        ram_std = stdev(list(ram_history)) if len(ram_history) > 1 else 0

        if cpu_std > 0 and cpu > cpu_mean + 2.5 * cpu_std:
            return True, f"CPU spike detected: {cpu:.1f}% (your normal avg: {cpu_mean:.1f}%)"
        if ram_std > 0 and ram > ram_mean + 2.5 * ram_std:
            return True, f"RAM spike detected: {ram:.1f}% (your normal avg: {ram_mean:.1f}%)"
    except:
        pass

    return False, None

def get_temperature_data():
    """Get current temperature and status"""
    try:
        temps = psutil.sensors_temperatures()
        if temps:
            for sensor_name, entries in temps.items():
                for entry in entries:
                    temp_history.append(entry.current)
                    return {
                        "sensor": sensor_name,
                        "label": entry.label or "CPU",
                        "temp_c": entry.current,
                        "high_threshold": entry.high or 85,
                        "critical_threshold": entry.critical or 95,
                        "status": "critical" if entry.current > (entry.critical or 95)
                                  else "high" if entry.current > (entry.high or 85)
                                  else "normal"
                    }
    except:
        pass
    return {"sensor": "unavailable", "temp_c": None, "status": "unavailable"}

def predict_overheating():
    """Predict if system will overheat"""
    if len(temp_history) < 10:
        return {"prediction": "insufficient_data", "eta_minutes": None, "current_temp": None}

    recent = list(temp_history)
    current = recent[-1]
    trend = (recent[-1] - recent[0]) / len(recent)

    if current > 85:
        return {"prediction": "overheating_now", "eta_minutes": 0, "current_temp": current}
    elif trend > 0.4 and current > 65:
        eta = max(1, int((85 - current) / (trend * 30)))
        return {"prediction": "overheating_soon", "eta_minutes": eta, "current_temp": current}
    return {"prediction": "normal", "eta_minutes": None, "current_temp": current}

def get_battery_info():
    """Get battery status"""
    try:
        b = psutil.sensors_battery()
        if b:
            time_left = int(b.secsleft / 60) if b.secsleft > 0 else None
            return {
                "percent": round(b.percent, 1),
                "plugged_in": b.power_plugged,
                "time_left_min": time_left,
                "status": "charging" if b.power_plugged else "discharging",
                "recommendation": (
                    "⚠️ Low battery! Plug in soon." if b.percent < 20 and not b.power_plugged
                    else "✅ Battery healthy." if b.percent > 50
                    else "Consider plugging in."
                )
            }
    except:
        pass
    return {"percent": None, "status": "unavailable", "recommendation": "Battery info not available on this device"}

def record_for_learning(cpu, ram):
    """Record metrics for pattern learning"""
    hour = datetime.datetime.now().hour
    hourly_cpu[hour].append(cpu)
    hourly_ram[hour].append(ram)

def get_personalized_recommendation():
    """Get personalized recommendation based on usage patterns"""
    pattern = {}
    for h in range(24):
        if hourly_cpu[h]:
            pattern[str(h)] = {
                "avg_cpu": round(mean(hourly_cpu[h]), 1),
                "avg_ram": round(mean(hourly_ram[h]), 1),
                "sample_count": len(hourly_cpu[h])
            }

    if not pattern:
        return {"message": "Still learning your patterns. Come back after a few hours.", "pattern": {}}

    peak_hour = max(pattern, key=lambda h: pattern[h]['avg_cpu'])
    peak_cpu = pattern[peak_hour]['avg_cpu']
    return {
        "peak_hour": int(peak_hour),
        "peak_cpu": peak_cpu,
        "message": f"Your system is busiest at {peak_hour}:00 with avg {peak_cpu}% CPU. Schedule heavy tasks outside this window.",
        "pattern": pattern
    }

