from fastapi import APIRouter, WebSocket, Depends, Query
from typing import Optional
import json
import asyncio
from services.monitor import get_system_metrics, get_process_list, check_anomaly
from services.root_cause import analyze_root_cause
from routers.auth import get_current_user
from sqlalchemy.orm import Session
from database import get_db

router = APIRouter(prefix="/metrics", tags=["metrics"])

# WebSocket: Real-time metrics streaming
@router.websocket("/ws/metrics")
async def metrics_websocket(websocket: WebSocket, user_id: Optional[int] = Query(None)):
    """WebSocket endpoint for real-time system metrics"""
    await websocket.accept()
    try:
        while True:
            # We pass user_id so it saves periodically to DB
            data = get_system_metrics(user_id=user_id)
            is_anomaly, msg = check_anomaly(data['cpu_percent'], data['ram_percent'])
            data['anomaly'] = is_anomaly
            data['anomaly_message'] = msg
            await websocket.send_json(data)
            await asyncio.sleep(2)
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        try:
            await websocket.close()
        except:
            pass

# REST: Get current metrics
@router.get("/current")
def get_current(user_id: Optional[int] = Query(None)):
    """Get current system metrics (one-time read)"""
    return get_system_metrics(user_id=user_id)

# REST: Get process list
@router.get("/processes")
def get_processes(user_id: Optional[int] = Query(None)):
    """Get list of top processes by CPU usage"""
    return get_process_list(user_id=user_id)

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
def autopilot_kill(pid: int, user_id: Optional[int] = Query(None)):
    """Kill a process"""
    from services.autopilot import kill_process
    return kill_process(pid, user_id=user_id)

@router.post("/autopilot/auto-check")
def autopilot_auto_check(user_id: Optional[int] = Query(None)):
    """Auto-kill top RAM process until RAM drops below threshold"""
    from services.autopilot import run_autopilot_check
    return run_autopilot_check(user_id=user_id)

@router.get("/autopilot/history")
def autopilot_history():
    """Get autopilot action history"""
    from services.autopilot import get_action_log
    return get_action_log()

# Learning endpoints
@router.get("/learning/pattern")
def learning_pattern(user_id: Optional[int] = Query(None)):
    """Get user's usage pattern"""
    from services.monitor import get_personalized_recommendation
    if not user_id:
        return {"message": "Please log in to see your personalized patterns."}
    return get_personalized_recommendation(user_id)

# Disk and Tasks
@router.get("/disk")
def disk_info():
    """Get disk health and usage info"""
    from services.monitor import get_disk_info
    return get_disk_info()

@router.get("/tasks")
def scheduled_tasks():
    """Get scheduled system tasks"""
    from services.monitor import get_scheduled_tasks
    return get_scheduled_tasks()

@router.post("/tasks/run")
def run_task(task_key: str):
    """Run a scheduled maintenance task immediately"""
    from services.maintenance import run_system_cleanup, run_deep_anomaly_scan
    if task_key == "system_cleanup":
        return run_system_cleanup()
    if task_key == "deep_anomaly_scan":
        return run_deep_anomaly_scan()
    return {"status": "error", "message": "Unknown task key"}

@router.post("/diagnostic/run")
def run_full_diagnostic():
    """Run a full diagnostic suite"""
    from services.maintenance import run_full_diagnostic
    return run_full_diagnostic()

@router.get("/notifications")
def get_recent_notifications():
    """Get recent system notifications"""
    from services.monitor import get_notifications
    return get_notifications()
