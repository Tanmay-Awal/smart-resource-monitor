import json
import os
from collections import deque
from statistics import mean, stdev

class CrashPredictor:
    """Simple crash prediction using statistical analysis (no ML libraries needed)"""

    def __init__(self):
        self.model_path = "models/crash_data.json"
        os.makedirs("models", exist_ok=True)
        self.cpu_history = deque(maxlen=100)
        self.ram_history = deque(maxlen=100)
        self.crash_events = []

    def train(self):
        """Store baseline data - no actual ML training needed"""
        print("✅ Crash predictor initialized (statistical mode)")

    def predict(self, cpu, ram, temp=55.0, disk=50.0) -> dict:
        """Predict crash probability using simple heuristics"""
        self.cpu_history.append(cpu)
        self.ram_history.append(ram)

        # Simple rule-based prediction
        crash_score = 0
        reasons = []

        # CPU critical
        if cpu > 90:
            crash_score += 40
            reasons.append("CPU usage critically high")
        elif cpu > 80:
            crash_score += 25
            reasons.append("CPU usage high")

        # RAM critical
        if ram > 95:
            crash_score += 40
            reasons.append("RAM almost full")
        elif ram > 85:
            crash_score += 20
            reasons.append("RAM usage high")

        # Temperature critical
        if temp > 90:
            crash_score += 35
            reasons.append("System temperature critical")
        elif temp > 80:
            crash_score += 15
            reasons.append("System temperature elevated")

        # CPU + RAM combo is dangerous
        if cpu > 75 and ram > 75:
            crash_score += 20
            reasons.append("High CPU and RAM simultaneously")

        # Trends detection
        if len(self.cpu_history) >= 10:
            try:
                cpu_trend = mean(list(self.cpu_history)[-5:]) - mean(list(self.cpu_history)[-10:-5])
                if cpu_trend > 15:  # Rapid increase
                    crash_score += 15
                    reasons.append("CPU usage rising rapidly")
            except:
                pass

        # Cap at 100
        crash_score = min(crash_score, 100)

        # Determine risk level
        if crash_score >= 70:
            risk = "CRITICAL"
            eta = max(2, int((100 - crash_score) / 10))
        elif crash_score >= 40:
            risk = "HIGH"
            eta = max(10, int((100 - crash_score) / 5))
        else:
            risk = "LOW"
            eta = 60

        return {
            "crash_probability": float(crash_score),
            "risk_level": risk,
            "time_to_crash_min": eta,
            "message": f"{crash_score}% crash probability" + (f" — crash in ~{eta} min" if crash_score > 40 else " — system is stable"),
            "reasons": reasons
        }


# Global predictor instance
predictor = CrashPredictor()
predictor.train()

