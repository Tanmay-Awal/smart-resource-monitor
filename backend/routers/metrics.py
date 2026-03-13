from fastapi import APIRouter, WebSocket, Depends
import json
import asyncio
from services.monitor import get_system_metrics, get_process_list, check_anomaly
from services.root_cause import analyze_root_cause

router = APIRouter(prefix="/metrics", tags=["metrics"])

# WebSocket: Real-time metrics streaming
@router.websocket("/ws/metrics")
async def metrics_websocket(websocket: WebSocket):
    """WebSocket endpoint for real-time system metrics"""
    await websocket.accept()
    try:
        while True:
            data = get_system_metrics()
            is_anomaly, msg = check_anomaly(data['cpu_percent'], data['ram_percent'])
            data['anomaly'] = is_anomaly
            data['anomaly_message'] = msg
            await websocket.send_json(data)
            await asyncio.sleep(2)
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()

# REST: Get current metrics
@router.get("/current")
def get_current():
    """Get current system metrics (one-time read)"""
    return get_system_metrics()

# REST: Get process list
@router.get("/processes")
def get_processes():
    """Get list of top processes by CPU usage"""
    return get_process_list()

# REST: Get root cause analysis
@router.get("/root-cause")
def root_cause():
    """Analyze root cause of performance issues"""
    metrics = get_system_metrics()
    processes = get_process_list()
    return analyze_root_cause(processes, metrics)

# REST: Get temperature
@router.get("/temperature")
def temperature():
    """Get current CPU temperature"""
    from services.monitor import get_temperature_data
    return get_temperature_data()

# REST: Predict overheating
@router.get("/temperature/predict")
def temp_predict():
    """Predict if system will overheat"""
    from services.monitor import predict_overheating
    return predict_overheating()

# REST: Get battery info
@router.get("/battery")
def battery():
    """Get battery status"""
    from services.monitor import get_battery_info
    return get_battery_info()

# Auto-Pilot endpoints
@router.get("/autopilot/status")
def autopilot_status():
    """Get autopilot status"""
    from services.autopilot import autopilot_enabled
    return {"autopilot_enabled": autopilot_enabled}

@router.post("/autopilot/toggle")
def autopilot_toggle(enable: bool):
    """Toggle autopilot mode"""
    from services.autopilot import toggle_autopilot
    state = toggle_autopilot(enable)
    return {"autopilot_enabled": state}

@router.post("/autopilot/kill/{pid}")
def autopilot_kill(pid: int):
    """Kill a process"""
    from services.autopilot import kill_process
    return kill_process(pid)

@router.get("/autopilot/history")
def autopilot_history():
    """Get autopilot action history"""
    from services.autopilot import get_action_log
    return get_action_log()

# Learning endpoints
@router.get("/learning/pattern")
def learning_pattern():
    """Get user's usage pattern"""
    from services.monitor import get_personalized_recommendation
    return get_personalized_recommendation()
