def analyze_root_cause(processes: list, metrics: dict) -> dict:
    """Analyze system performance issues and identify root causes"""
    issues = []
    suggestions = []

    # Top CPU hog
    top_cpu = sorted(processes, key=lambda x: x['cpu_percent'], reverse=True)[:5]
    for p in top_cpu:
        if p['cpu_percent'] > 25:
            issues.append(f"'{p['name']}' is consuming {p['cpu_percent']}% CPU")
            suggestions.append(f"Try restarting or closing '{p['name']}'")

    # Hidden background pollers (many small processes, silent killers)
    mid_cpu = [p for p in processes if 2 < p['cpu_percent'] <= 10]
    if len(mid_cpu) >= 5:
        names = ", ".join([p['name'] for p in mid_cpu[:3]])
        issues.append(f"Multiple background apps quietly consuming CPU: {names}...")
        suggestions.append("Open Task Manager and disable unnecessary startup programs")

    # RAM pressure
    if metrics['ram_percent'] > 85:
        top_ram = sorted(processes, key=lambda x: x['ram_mb'], reverse=True)[:2]
        for p in top_ram:
            if p['ram_mb'] > 400:
                issues.append(f"'{p['name']}' is holding {p['ram_mb']} MB of RAM")

    # Memory leak hint
    if metrics['ram_percent'] > 90 and metrics['cpu_percent'] < 30:
        issues.append("High RAM but low CPU — this pattern often means a memory leak")
        suggestions.append("Restart the app with the highest RAM usage")

    if not issues:
        return {
            "status": "healthy",
            "summary": "System is running normally.",
            "issues": [],
            "suggestions": []
        }

    return {
        "status": "degraded",
        "summary": f"{len(issues)} performance issue(s) detected.",
        "issues": issues,
        "suggestions": suggestions
    }
