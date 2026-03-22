import os
import time
import tempfile
from typing import Any, Optional
import psutil

from services.monitor import (
    get_system_metrics,
    get_disk_info,
    get_temperature_data,
    predict_overheating,
    get_battery_info
)
from services.root_cause import analyze_root_cause

CPU_WARN = 80.0
CPU_CRIT = 90.0
RAM_WARN = 80.0
RAM_CRIT = 90.0

def _score_overall_status(flags: list[str]) -> str:
    if "CRITICAL" in flags:
        return "CRITICAL"
    if "WARNING" in flags:
        return "WARNING"
    if "PASS" in flags:
        return "PASS"
    return "UNKNOWN"

def _metrics_flags(cpu: float, ram: float, temp_status: str, disk_health: str) -> list[str]:
    flags: list[str] = []
    if cpu >= CPU_CRIT or ram >= RAM_CRIT:
        flags.append("CRITICAL")
    elif cpu >= CPU_WARN or ram >= RAM_WARN:
        flags.append("WARNING")
    else:
        flags.append("PASS")

    if temp_status == "critical":
        flags.append("CRITICAL")
    elif temp_status == "high":
        flags.append("WARNING")

    if disk_health == "CRITICAL":
        flags.append("CRITICAL")
    elif disk_health == "WARNING":
        flags.append("WARNING")
    elif disk_health == "PASS":
        flags.append("PASS")

    return flags

def _collect_warnings(
    peak_cpu: float,
    peak_ram: float,
    disk_info: dict[str, Any],
    root_cause: dict[str, Any],
    temp_status: Optional[str] = None,
    overheat: Optional[dict[str, Any]] = None,
    battery: Optional[dict[str, Any]] = None
) -> tuple[list[str], list[str]]:
    warnings: list[str] = []
    suggestions: list[str] = []

    if peak_cpu >= CPU_CRIT:
        warnings.append(f"CPU peak at {peak_cpu}% (critical).")
    elif peak_cpu >= CPU_WARN:
        warnings.append(f"CPU peak at {peak_cpu}% (warning).")

    if peak_ram >= RAM_CRIT:
        warnings.append(f"RAM peak at {peak_ram}% (critical).")
    elif peak_ram >= RAM_WARN:
        warnings.append(f"RAM peak at {peak_ram}% (warning).")

    disk_health = disk_info.get("health_summary")
    if disk_health and disk_health not in ("PASS", "UNKNOWN"):
        warnings.append(f"Disk SMART health is {disk_health}.")

    system_usage = disk_info.get("system_usage") if isinstance(disk_info, dict) else None
    if isinstance(system_usage, dict):
        usage_percent = system_usage.get("percent")
        if isinstance(usage_percent, (int, float)):
            if usage_percent >= 90:
                warnings.append(f"Disk capacity critical: {usage_percent}% used.")
                suggestions.append("Free up space on the system drive to prevent slowdowns.")
            elif usage_percent >= 80:
                warnings.append(f"Disk capacity warning: {usage_percent}% used.")
                suggestions.append("Consider cleaning up large files or moving data off the system drive.")

    if temp_status in ("high", "critical"):
        warnings.append(f"Temperature status: {temp_status}.")

    if overheat:
        prediction = overheat.get("prediction")
        if prediction in ("overheating_now", "overheating_soon"):
            warnings.append(f"Overheating risk: {prediction.replace('_', ' ')}.")

    if battery:
        percent = battery.get("percent")
        plugged = battery.get("plugged_in")
        if isinstance(percent, (int, float)) and percent < 20 and plugged is False:
            warnings.append(f"Battery low at {percent}%.")

    if root_cause.get("status") == "degraded":
        warnings.extend(root_cause.get("issues", []))
        suggestions.extend(root_cause.get("suggestions", []))

    return warnings, suggestions

def run_full_diagnostic(samples: int = 5, delay_seconds: float = 1.0) -> dict[str, Any]:
    scan = run_deep_anomaly_scan(samples=samples, delay_seconds=delay_seconds)
    disk_info = get_disk_info()
    temperature = get_temperature_data()
    overheat = predict_overheating()
    battery = get_battery_info()

    flags = _metrics_flags(
        scan["metrics_peak"]["cpu_percent"],
        scan["metrics_peak"]["ram_percent"],
        temperature.get("status", "unavailable"),
        disk_info.get("health_summary", "UNKNOWN")
    )

    overall = _score_overall_status(flags)
    summary = "Full diagnostic completed."
    if overall == "CRITICAL":
        summary = "Critical issues detected during full diagnostic."
    elif overall == "WARNING":
        summary = "Warnings detected during full diagnostic."
    warnings, suggestions = _collect_warnings(
        scan["metrics_peak"]["cpu_percent"],
        scan["metrics_peak"]["ram_percent"],
        disk_info,
        scan.get("root_cause", {}),
        temperature.get("status"),
        overheat,
        battery
    )

    return {
        "status": "completed",
        "overall_status": overall,
        "summary": summary,
        "warnings": warnings,
        "suggestions": suggestions,
        "scan": scan,
        "disk_health": disk_info,
        "temperature": temperature,
        "overheat_prediction": overheat,
        "battery": battery,
        "timestamp": time.time()
    }

def run_deep_anomaly_scan(samples: int = 5, delay_seconds: float = 1.0) -> dict[str, Any]:
    metrics_samples = []
    for index in range(samples):
        metrics_samples.append(get_system_metrics())
        if index < samples - 1:
            time.sleep(delay_seconds)

    avg_cpu = round(sum(m["cpu_percent"] for m in metrics_samples) / samples, 1)
    avg_ram = round(sum(m["ram_percent"] for m in metrics_samples) / samples, 1)
    peak_cpu = round(max(m["cpu_percent"] for m in metrics_samples), 1)
    peak_ram = round(max(m["ram_percent"] for m in metrics_samples), 1)

    latest = metrics_samples[-1]
    processes = _collect_processes()
    root_cause = analyze_root_cause(processes, latest)
    disk_info = get_disk_info()

    flags = _metrics_flags(peak_cpu, peak_ram, "normal", disk_info.get("health_summary", "UNKNOWN"))
    if root_cause.get("status") == "degraded":
        flags.append("WARNING")

    overall = _score_overall_status(flags)
    summary = "Deep anomaly scan completed."
    if overall == "CRITICAL":
        summary = "Critical performance risks detected during deep scan."
    elif overall == "WARNING":
        summary = "Warnings detected during deep scan."

    top_cpu = sorted(processes, key=lambda p: p["cpu_percent"], reverse=True)[:5]
    top_ram = sorted(processes, key=lambda p: p["ram_mb"], reverse=True)[:5]
    warnings, suggestions = _collect_warnings(
        peak_cpu,
        peak_ram,
        disk_info,
        root_cause
    )

    return {
        "status": overall,
        "summary": summary,
        "warnings": warnings,
        "suggestions": suggestions,
        "metrics_avg": {"cpu_percent": avg_cpu, "ram_percent": avg_ram},
        "metrics_peak": {"cpu_percent": peak_cpu, "ram_percent": peak_ram},
        "metrics_samples": metrics_samples,
        "root_cause": root_cause,
        "disk_health": disk_info,
        "processes_top_cpu": top_cpu,
        "processes_top_ram": top_ram
    }

def _collect_processes() -> list[dict[str, Any]]:
    processes = []
    cpu_count = psutil.cpu_count(logical=True) or 1
    proc_list = []

    for proc in psutil.process_iter(['pid', 'name', 'memory_info', 'status']):
        try:
            proc.cpu_percent(None)
            proc_list.append(proc)
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            continue

    time.sleep(0.1)

    for proc in proc_list:
        try:
            mem_info = proc.memory_info()
            cpu_raw = proc.cpu_percent(None)
            cpu_percent = round(min(cpu_raw / cpu_count, 100.0), 1)
            processes.append({
                "pid": proc.pid,
                "name": proc.name() or "Unknown",
                "cpu_percent": cpu_percent,
                "ram_mb": round(mem_info.rss / (1024**2), 2) if mem_info else 0,
                "status": proc.status()
            })
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            continue
    return processes

def run_system_cleanup(days: int = 7) -> dict[str, Any]:
    temp_dir = tempfile.gettempdir()
    cutoff = time.time() - (days * 86400)
    removed_files = 0
    removed_bytes = 0
    removed_dirs = 0
    errors: list[str] = []

    for root, _, files in os.walk(temp_dir):
        for name in files:
            path = os.path.join(root, name)
            try:
                stat = os.stat(path)
            except (FileNotFoundError, PermissionError, OSError):
                continue
            if stat.st_mtime > cutoff:
                continue
            try:
                os.remove(path)
                removed_files += 1
                removed_bytes += stat.st_size
            except (PermissionError, OSError) as exc:
                errors.append(f"Failed to delete {path}: {exc}")

    for root, dirs, files in os.walk(temp_dir, topdown=False):
        if root == temp_dir:
            continue
        if files or dirs:
            continue
        try:
            os.rmdir(root)
            removed_dirs += 1
        except (PermissionError, OSError):
            continue

    summary = f"Removed {removed_files} temp files and freed {round(removed_bytes / (1024**2), 2)} MB."
    return {
        "status": "completed",
        "summary": summary,
        "temp_dir": temp_dir,
        "removed_files": removed_files,
        "removed_dirs": removed_dirs,
        "freed_mb": round(removed_bytes / (1024**2), 2),
        "errors": errors
    }
