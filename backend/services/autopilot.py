import psutil
from typing import Optional
from database import SessionLocal
from models.models import AutopilotAction

PROTECTED = ['explorer.exe', 'systemd', 'svchost.exe', 'python', 'code', 'chrome', 'postgres']
RAM_THRESHOLD_PERCENT = 85.0
MAX_AUTO_KILLS_PER_CHECK = 3
autopilot_enabled = False

def toggle_autopilot(enable: bool):
    """Toggle autopilot mode on/off"""
    global autopilot_enabled
    autopilot_enabled = enable
    return autopilot_enabled

def kill_process(pid: int, user_id: Optional[int] = None, reason: str = "Performance optimization") -> dict:
    """Terminate a process and log to DB"""
    try:
        proc = psutil.Process(pid)
        name = proc.name()
        if name.lower() in PROTECTED:
            return {
                "success": False,
                "reason": f"'{name}' is a protected process and cannot be killed"
            }
        
        proc.terminate()
        
        # Save to database
        db = SessionLocal()
        try:
            db_action = AutopilotAction(
                user_id=user_id,
                action_type="terminate",
                target_name=name,
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

        return {"success": True, "message": f"'{name}' (PID {pid}) terminated"}
    except psutil.NoSuchProcess:
        return {"success": False, "reason": "Process not found"}
    except Exception as e:
        return {"success": False, "reason": str(e)}

def get_highest_ram_process():
    """Return the non-protected process using the most RAM."""
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'memory_info']):
        try:
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
    """Auto-kill top RAM process until RAM drops below threshold."""
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
    while current_ram >= RAM_THRESHOLD_PERCENT and kills < MAX_AUTO_KILLS_PER_CHECK:
        target = get_highest_ram_process()
        if not target:
            return {
                "status": "no_killable_process",
                "ram_percent": current_ram,
                "threshold": RAM_THRESHOLD_PERCENT,
                "actions": actions
            }

        result = kill_process(
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
        kills += 1

        if not result.get("success"):
            break

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
