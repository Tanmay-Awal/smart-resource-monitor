import os
import ctypes
from ctypes import wintypes
import psutil
from typing import Optional
from database import SessionLocal
from models.models import AutopilotAction

PROTECTED = [
    'explorer.exe',
    'systemd',
    'svchost.exe',
    'python.exe',
    'pythonw.exe',
    'uvicorn.exe',
    'node.exe',
    'code.exe',
    'chrome.exe',
    'postgres',
    'postgres.exe'
]
RAM_THRESHOLD_PERCENT = 85.0
MAX_AUTO_KILLS_PER_CHECK = 3
GRACEFUL_CLOSE_TIMEOUT_SECONDS = 3
ALLOW_FORCE_TERMINATE = True
autopilot_enabled = False

def toggle_autopilot(enable: bool):
    """Toggle autopilot mode on/off"""
    global autopilot_enabled
    autopilot_enabled = enable
    return autopilot_enabled

def log_autopilot_action(
    user_id: Optional[int],
    action_type: str,
    target_name: str,
    pid: int,
    reason: str
):
    """Persist autopilot action to DB."""
    db = SessionLocal()
    try:
        db_action = AutopilotAction(
            user_id=user_id,
            action_type=action_type,
            target_name=target_name,
            pid=pid,
            reason=reason,
            executed_by="autopilot" if autopilot_enabled else "user"
        )
        db.add(db_action)
        db.commit()
    except Exception as e:
        print(f"Error logging autopilot action: {e}")
        db.rollback()
    finally:
        db.close()

def kill_process(
    pid: int,
    user_id: Optional[int] = None,
    reason: str = "Performance optimization",
    action_type: str = "terminate"
) -> dict:
    """Terminate a process and log to DB"""
    try:
        if pid == os.getpid():
            return {
                "success": False,
                "reason": "Current server process is protected"
            }
        proc = psutil.Process(pid)
        name = proc.name()
        if name.lower() in PROTECTED:
            return {
                "success": False,
                "reason": f"'{name}' is a protected process and cannot be killed"
            }
        
        proc.terminate()
        
        log_autopilot_action(user_id, action_type, name, pid, reason)

        return {"success": True, "message": f"'{name}' (PID {pid}) terminated"}
    except psutil.NoSuchProcess:
        return {"success": False, "reason": "Process not found"}
    except Exception as e:
        return {"success": False, "reason": str(e)}

def _get_window_handles_for_pid(pid: int):
    if os.name != "nt":
        return []

    handles = []
    enum_proc = ctypes.WINFUNCTYPE(ctypes.c_bool, wintypes.HWND, wintypes.LPARAM)

    @enum_proc
    def foreach_window(hwnd, lparam):
        window_pid = wintypes.DWORD()
        ctypes.windll.user32.GetWindowThreadProcessId(hwnd, ctypes.byref(window_pid))
        if window_pid.value == pid and ctypes.windll.user32.IsWindowVisible(hwnd):
            handles.append(hwnd)
        return True

    ctypes.windll.user32.EnumWindows(foreach_window, 0)
    return handles

def close_process(pid: int, user_id: Optional[int] = None, reason: str = "Auto-pilot close request") -> dict:
    """Request a GUI app to close (like clicking X)."""
    if os.name != "nt":
        return {"success": False, "reason": "Window close not supported on this OS"}

    try:
        if pid == os.getpid():
            return {
                "success": False,
                "reason": "Current server process is protected"
            }
        proc = psutil.Process(pid)
        name = proc.name()
        if name.lower() in PROTECTED:
            return {
                "success": False,
                "reason": f"'{name}' is a protected process and cannot be closed"
            }

        handles = _get_window_handles_for_pid(pid)
        if not handles:
            if ALLOW_FORCE_TERMINATE:
                return kill_process(pid, user_id=user_id, reason=reason, action_type="terminate")
            return {"success": False, "reason": "No window handle found to close"}

        for hwnd in handles:
            ctypes.windll.user32.PostMessageW(hwnd, 0x0010, 0, 0)

        try:
            proc.wait(timeout=GRACEFUL_CLOSE_TIMEOUT_SECONDS)
        except psutil.TimeoutExpired:
            if ALLOW_FORCE_TERMINATE:
                return kill_process(pid, user_id=user_id, reason=reason, action_type="terminate")
            return {"success": False, "reason": "Close request timed out"}

        log_autopilot_action(user_id, "close", name, pid, reason)
        return {"success": True, "message": f"'{name}' (PID {pid}) closed"}
    except psutil.NoSuchProcess:
        return {"success": False, "reason": "Process not found"}
    except Exception as e:
        return {"success": False, "reason": str(e)}

def get_highest_ram_process(excluded_pids: Optional[set[int]] = None):
    """Return the non-protected process using the most RAM."""
    excluded_pids = excluded_pids or set()
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'memory_info']):
        try:
            pid = proc.info.get('pid')
            if pid == os.getpid() or pid in excluded_pids:
                continue
            name = proc.info.get('name')
            if not name:
                continue
            if name.lower() in PROTECTED:
                continue
            mem_info = proc.info.get('memory_info')
            if not mem_info:
                continue
            processes.append({
                "pid": proc.info['pid'],
                "name": name,
                "ram_mb": round(mem_info.rss / (1024**2), 2)
            })
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            continue

    if not processes:
        return None

    return max(processes, key=lambda p: p['ram_mb'])

def run_autopilot_check(user_id: Optional[int] = None) -> dict:
    """Auto-close top RAM process until RAM drops below threshold."""
    if not autopilot_enabled:
        return {"status": "disabled"}

    ram = psutil.virtual_memory()
    current_ram = round(ram.percent, 1)
    if current_ram < RAM_THRESHOLD_PERCENT:
        return {
            "status": "below_threshold",
            "ram_percent": current_ram,
            "threshold": RAM_THRESHOLD_PERCENT
        }

    actions = []
    kills = 0
    excluded_pids: set[int] = set()
    while current_ram >= RAM_THRESHOLD_PERCENT and kills < MAX_AUTO_KILLS_PER_CHECK:
        target = get_highest_ram_process(excluded_pids)
        if not target:
            return {
                "status": "no_killable_process",
                "ram_percent": current_ram,
                "threshold": RAM_THRESHOLD_PERCENT,
                "actions": actions
            }

        result = close_process(
            target["pid"],
            user_id=user_id,
            reason=f"Auto-pilot: RAM {current_ram:.1f}% >= {RAM_THRESHOLD_PERCENT}%"
        )
        actions.append({
            "pid": target["pid"],
            "name": target["name"],
            "ram_mb": target["ram_mb"],
            "result": result
        })
        if result.get("success"):
            kills += 1
        else:
            excluded_pids.add(target["pid"])

        current_ram = round(psutil.virtual_memory().percent, 1)

    status = "reduced" if current_ram < RAM_THRESHOLD_PERCENT else "threshold_still_high"
    return {
        "status": status,
        "ram_percent": current_ram,
        "threshold": RAM_THRESHOLD_PERCENT,
        "actions": actions
    }

def get_action_log(user_id: Optional[int] = None):
    """Get action history from DB"""
    db = SessionLocal()
    try:
        query = db.query(AutopilotAction)
        if user_id:
            query = query.filter(AutopilotAction.user_id == user_id)
        
        actions = query.order_by(AutopilotAction.executed_at.desc()).limit(15).all()
        return [
            {
                "pid": a.pid,
                "name": a.target_name,
                "action": a.action_type,
                "by": a.executed_by,
                "time": a.executed_at.isoformat() if a.executed_at else None
            } for a in actions
        ]
    finally:
        db.close()
