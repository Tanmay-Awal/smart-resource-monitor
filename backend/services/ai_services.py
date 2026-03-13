import os
from config import OPENAI_API_KEY
from services.monitor import get_system_metrics, get_process_list
from services.root_cause import analyze_root_cause

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

Answer the user specifically based on this real data. Be helpful, concise, and suggest actions."""
    except:
        return "You are a system performance assistant. Help the user understand their computer's performance."

def answer_chat(message: str) -> str:
    """Answer user chat messages using OpenAI"""
    if not OPENAI_API_KEY:
        return "AI assistant is not configured. Please set OPENAI_API_KEY."

    try:
        import openai
        openai.api_key = OPENAI_API_KEY
        context = build_system_context()

        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": context},
                {"role": "user", "content": message}
            ],
            max_tokens=300,
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"I'm having trouble connecting to the AI service. Error: {str(e)}"

def generate_daily_story() -> str:
    """Generate a friendly daily performance story"""
    if not OPENAI_API_KEY:
        metrics = get_system_metrics()
        processes = get_process_list()
        top_app = processes[0]['name'] if processes else "Unknown"
        return f"Your system ran at {metrics['cpu_percent']}% CPU with {metrics['ram_percent']}% RAM today. Top app was {top_app}."

    try:
        import openai
        openai.api_key = OPENAI_API_KEY
        metrics = get_system_metrics()
        processes = get_process_list()
        top_app = processes[0]['name'] if processes else "Unknown"

        prompt = f"""Write a short (3-4 sentences), friendly daily summary about this computer's performance.
Stats: CPU at {metrics['cpu_percent']}%, RAM at {metrics['ram_percent']}%, top app is {top_app}.
Be conversational, highlight one insight, keep it simple and non-technical."""

        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200
        )
        return response.choices[0].message.content
    except:
        metrics = get_system_metrics()
        processes = get_process_list()
        top_app = processes[0]['name'] if processes else "Unknown"
        return f"Your system ran at {metrics['cpu_percent']}% CPU with {metrics['ram_percent']}% RAM today. Top app was {top_app}."
