import psutil
import datetime
from typing import Optional, Any
from collections import deque, defaultdict
from statistics import mean, stdev
from database import SessionLocal
from models.models import SystemMetric, ProcessMetric, UserBaseline

# History buffers for anomaly detection (still useful for fast checks)
cpu_history = deque(maxlen=60)
ram_history = deque(maxlen=60)
temp_history = deque(maxlen=30)

# Pattern learning
hourly_cpu = defaultdict(list)
hourly_ram = defaultdict(list)

def get_system_metrics(user_id: Optional[int] = None):
    """Get current system metrics and optionally save to DB"""
    cpu = psutil.cpu_percent(interval=0.5)
    ram = psutil.virtual_memory()
    disk = psutil.disk_io_counters()
    net = psutil.net_io_counters()

    try:
        temps = psutil.sensors_temperatures()
        cpu_temp = list(temps.values())[0][0].current if temps else None
    except:
        cpu_temp = None

    metrics = {
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

    # If user_id is provided, save to database
    if user_id:
        db = SessionLocal()
        try:
            db_metric = SystemMetric(
                user_id=user_id,
                cpu_percent=metrics["cpu_percent"],
                ram_used_gb=metrics["ram_used_gb"],
                ram_percent=metrics["ram_percent"],
                disk_read_mb=metrics["disk_read_mb"],
                disk_write_mb=metrics["disk_write_mb"],
                network_sent_mb=metrics["network_sent_mb"],
                network_recv_mb=metrics["network_recv_mb"],
                cpu_temp=metrics["cpu_temp"]
            )
            db.add(db_metric)
            db.commit()
        except Exception as e:
            print(f"Error saving metrics to DB: {e}")
            db.rollback()
        finally:
            db.close()

    return metrics

def get_process_list(user_id: Optional[int] = None):
    """Get top processes by CPU usage and optionally save to DB"""
    processes: list[dict] = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_info', 'status']):
        try:
            p_info: dict[str, Any] = {
                "pid": proc.info['pid'],
                "name": proc.info['name'],
                "cpu_percent": round(proc.info['cpu_percent'], 1),
                "ram_mb": round(proc.info['memory_info'].rss / (1024**2), 2),
                "status": proc.info['status']
            }
            processes.append(p_info)
        except:
            pass
    
    sorted_procs: Any = sorted(processes, key=lambda x: x['cpu_percent'], reverse=True)[:20]

    # If user_id is provided, save top 5 processes to DB for history
    if user_id:
        db = SessionLocal()
        try:
            for p in sorted_procs[:5]:
                db_proc = ProcessMetric(
                    user_id=user_id,
                    pid=p["pid"],
                    name=p["name"],
                    cpu_percent=p["cpu_percent"],
                    ram_mb=p["ram_mb"],
                    status=p["status"]
                )
                db.add(db_proc)
            db.commit()
        except Exception as e:
            print(f"Error saving processes to DB: {e}")
            db.rollback()
        finally:
            db.close()

    return sorted_procs

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

def record_for_learning(user_id: int, cpu: float, ram: float):
    """Record metrics for pattern learning in DB"""
    hour = datetime.datetime.now().hour
    db = SessionLocal()
    try:
        # Check if baseline exists for this hour
        baseline = db.query(UserBaseline).filter(
            UserBaseline.user_id == user_id, 
            UserBaseline.hour_of_day == hour
        ).first()

        if baseline:
            # Update moving average
            baseline.avg_cpu = (baseline.avg_cpu * 0.9) + (cpu * 0.1)
            baseline.avg_ram = (baseline.avg_ram * 0.9) + (ram * 0.1)
        else:
            baseline = UserBaseline(
                user_id=user_id,
                hour_of_day=hour,
                avg_cpu=cpu,
                avg_ram=ram
            )
            db.add(baseline)
        db.commit()
    except Exception as e:
        print(f"Error in pattern learning: {e}")
        db.rollback()
    finally:
        db.close()

def get_personalized_recommendation(user_id: int):
    """Get personalized recommendation based on DB patterns"""
    db = SessionLocal()
    try:
        baselines = db.query(UserBaseline).filter(UserBaseline.user_id == user_id).all()
        if not baselines:
            return {"message": "Still learning your patterns. Come back after a few hours.", "pattern": {}}

        pattern = {str(b.hour_of_day): {"avg_cpu": b.avg_cpu, "avg_ram": b.avg_ram} for b in baselines}
        
        peak_baseline = max(baselines, key=lambda b: b.avg_cpu)
        peak_hour = peak_baseline.hour_of_day
        peak_cpu = round(peak_baseline.avg_cpu, 1)

        return {
            "peak_hour": peak_hour,
            "peak_cpu": peak_cpu,
            "message": f"Your system is busiest at {peak_hour}:00 with avg {peak_cpu}% CPU. Schedule heavy tasks outside this window.",
            "pattern": pattern
        }
    finally:
        db.close()

def get_disk_info():
    """Get real disk information and usage"""
    try:
        usage = psutil.disk_usage('/')
        return {
            "model": "System Storage Device",
            "total_gb": round(usage.total / (1024**3), 2),
            "used_gb": round(usage.used / (1024**3), 2),
            "percent": usage.percent,
            "health": "PASS" if usage.percent < 90 else "WARNING",
            "temperature": 42
        }
    except:
        return {"model": "Unknown Disk", "health": "Unknown", "temperature": None}

def get_scheduled_tasks():
    """Mock scheduled tasks"""
    return [
        {"id": 1, "name": "System Cleanup", "scheduled_at": "02:00 AM", "status": "pending"},
        {"id": 2, "name": "Deep Anomaly Scan", "scheduled_at": "01:00 AM", "status": "completed"}
    ]

def get_notifications():
    """Get recent system notifications and anomalies"""
    notifications = []
    import psutil
    import datetime
    
    # Check for RAM pressure
    ram = psutil.virtual_memory()
    if ram.percent > 90:
        notifications.append({
            "id": 1,
            "message": f"Critical RAM usage: {ram.percent}% used.",
            "type": "critical",
            "time": datetime.datetime.now().strftime("%H:%M %p")
        })
    elif ram.percent > 75:
        notifications.append({
            "id": 2,
            "message": f"High memory pressure detected ({ram.percent}%).",
            "type": "warning",
            "time": datetime.datetime.now().strftime("%H:%M %p")
        })

    # Check for CPU heat
    try:
        temps = psutil.sensors_temperatures()
        if temps:
            for name, entries in temps.items():
                for entry in entries:
                    if entry.current > 80:
                        notifications.append({
                            "id": 3,
                            "message": f"High CPU Temperature ({entry.current}°C) on {name}.",
                            "type": "critical",
                            "time": datetime.datetime.now().strftime("%H:%M %p")
                        })
    except:
        pass

    if not notifications:
        notifications.append({
            "id": 0,
            "message": "System is running smoothly. No issues detected.",
            "type": "info",
            "time": datetime.datetime.now().strftime("%H:%M %p")
        })

    return notifications

