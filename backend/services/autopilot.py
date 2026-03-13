import psutil

PROTECTED = ['explorer.exe', 'systemd', 'svchost.exe', 'python', 'code', 'chrome']
action_log = []
autopilot_enabled = False

def toggle_autopilot(enable: bool):
    """Toggle autopilot mode on/off"""
    global autopilot_enabled
    autopilot_enabled = enable
    return autopilot_enabled

def kill_process(pid: int) -> dict:
    """Terminate a process"""
    try:
        proc = psutil.Process(pid)
        name = proc.name()
        if name.lower() in PROTECTED:
            return {
                "success": False,
                "reason": f"'{name}' is a protected process and cannot be killed"
            }
        proc.terminate()
        action_log.append({
            "pid": pid,
            "name": name,
            "action": "terminated",
            "by": "autopilot" if autopilot_enabled else "user"
        })
        return {"success": True, "message": f"'{name}' (PID {pid}) terminated"}
    except psutil.NoSuchProcess:
        return {"success": False, "reason": "Process not found"}
    except Exception as e:
        return {"success": False, "reason": str(e)}

def get_action_log():
    """Get action history (last 15)"""
    return list(reversed(action_log))[-15:]
