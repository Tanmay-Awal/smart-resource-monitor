import re

from config import OPENAI_API_KEY, OPENAI_MODEL, GROQ_API_KEY, GROQ_MODEL
from services.monitor import get_system_metrics, get_process_list
from services.root_cause import analyze_root_cause

def _get_ai_client():
    try:
        from openai import OpenAI
    except Exception:
        return None, None

    if GROQ_API_KEY:
        return OpenAI(api_key=GROQ_API_KEY, base_url="https://api.groq.com/openai/v1"), "groq"
    if OPENAI_API_KEY:
        return OpenAI(api_key=OPENAI_API_KEY), "openai"
    return None, None

def _get_model(provider: str) -> str:
    if provider == "groq":
        return GROQ_MODEL
    return OPENAI_MODEL

def _is_greeting(message: str) -> bool:
    text = message.strip().lower()
    return text in {"hi", "hello", "hey", "yo", "hola", "hii", "heyy"}

def _is_pc_related(message: str) -> bool:
    text = message.lower()
    keywords = [
        "pc", "computer", "system", "cpu", "ram", "memory", "disk", "ssd", "hdd",
        "temperature", "temp", "process", "lag", "slow", "freeze", "performance",
        "battery", "network", "autopilot", "resource", "monitor", "task manager"
    ]
    return any(word in text for word in keywords)

def _fit_to_three_lines(text: str) -> str:
    cleaned = " ".join(text.strip().split())
    sentences = re.split(r'(?<=[.!?])\s+', cleaned)
    trimmed = " ".join(sentences[:3]).strip()
    if len(trimmed) > 360:
        trimmed = trimmed[:357].rstrip() + "..."
    return trimmed

def build_system_context() -> str:
    """Build current system state as context for AI"""
    try:
        metrics = get_system_metrics()
        processes = get_process_list()
        root = analyze_root_cause(processes, metrics)
        top_procs = ", ".join([f"{p['name']} ({p['cpu_percent']}% CPU)" for p in processes[:3]]) if processes else "None"

        return f"""You are an intelligent system performance assistant for Smart Resource Monitor.
Current system state:
- CPU Usage: {metrics['cpu_percent']}%
- RAM Usage: {metrics['ram_percent']}% ({metrics['ram_used_gb']} GB used)
- CPU Temperature: {metrics.get('cpu_temp', 'N/A')}°C
- Top processes: {top_procs}
- System status: {root['status']} — {root['summary']}
- Issues: {'; '.join(root['issues']) if root['issues'] else 'None'}

Rules:
1) Reply in max 2-3 short lines.
2) Stay focused only on this PC's health/performance.
3) If user is just greeting, respond with a short greeting and ask what PC issue they need help with."""
    except Exception:
        return "You are a system performance assistant. Help the user understand their computer's performance."

def answer_chat(message: str) -> str:
    """Answer user chat messages using Groq/OpenAI"""
    if _is_greeting(message):
        return "Hi! I can help with your PC health and performance.\nTell me what issue you want to check."

    if not _is_pc_related(message):
        return "I'm here to help with your PC health and performance only.\nPlease ask a system-related question."

    client, provider = _get_ai_client()
    if not client:
        return "AI assistant is not configured. Please set GROQ_API_KEY or OPENAI_API_KEY."

    try:
        context = build_system_context()

        response = client.chat.completions.create(
            model=_get_model(provider),
            messages=[
                {"role": "system", "content": context},
                {"role": "user", "content": message}
            ],
            max_tokens=110,
            temperature=0.2
        )
        content = response.choices[0].message.content or ""
        return _fit_to_three_lines(content)
    except Exception as e:
        return f"I'm having trouble connecting to the AI service. Error: {str(e)}"

def generate_daily_story() -> str:
    """Generate a friendly daily performance story"""
    client, provider = _get_ai_client()
    if not client:
        metrics = get_system_metrics()
        processes = get_process_list()
        top_app = processes[0]['name'] if processes else "Unknown"
        return f"Your system ran at {metrics['cpu_percent']}% CPU with {metrics['ram_percent']}% RAM today. Top app was {top_app}."

    try:
        metrics = get_system_metrics()
        processes = get_process_list()
        top_app = processes[0]['name'] if processes else "Unknown"

        prompt = f"""Write a short (3-4 sentences), friendly daily summary about this computer's performance.
Stats: CPU at {metrics['cpu_percent']}%, RAM at {metrics['ram_percent']}%, top app is {top_app}.
Be conversational, highlight one insight, keep it simple and non-technical."""

        response = client.chat.completions.create(
            model=_get_model(provider),
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200
        )
        return response.choices[0].message.content
    except Exception:
        metrics = get_system_metrics()
        processes = get_process_list()
        top_app = processes[0]['name'] if processes else "Unknown"
        return f"Your system ran at {metrics['cpu_percent']}% CPU with {metrics['ram_percent']}% RAM today. Top app was {top_app}."
