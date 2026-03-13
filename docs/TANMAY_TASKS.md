# 🧑‍💻 TANMAY'S TASK SHEET — Smart Resource Monitor
**Duration:** 30 Days | **Teammate:** Himanshu
**Your Role:** Backend core + Features 1, 2, 3, 4, 5 (out of 11)

---

> ⚠️ **HOW DEPENDENCY WORKS:**
> At several points you CANNOT move forward until Himanshu finishes his part. These are marked 🔴 **BLOCKED — Wait for Himanshu**. Points where Himanshu is waiting on you are marked 🟢 **Himanshu is waiting on YOU**.

---

## 🗂️ YOUR FEATURE OWNERSHIP

You and Himanshu each own 5 features. You handle the **backend logic** for your 5 features; Himanshu will build the **UI** that connects to your APIs.

| # | Feature | What You Build |
|---|---------|---------------|
| 1 | Real-Time System Monitoring | psutil engine, WebSocket server, metrics API |
| 2 | Root Cause Analysis | Process analysis engine, hidden killer detection |
| 3 | Crash Prediction | ML model (Random Forest), prediction API |
| 4 | Thermal & Battery Management | Temp monitoring, overheating prediction, battery API |
| 5 | AI Chatbot Assistant | LLM integration, chat API, context management |
| 11 | Personalized System Learning | Backend data collection + pattern API (built together with Himanshu) |

---

## 📦 PHASE 1 — FOUNDATION (Days 1–4)

### ✅ Day 1 — Project & Repo Setup (TOGETHER with Himanshu)

Sit together and do this:

```bash
git init smart-resource-monitor
cd smart-resource-monitor
mkdir frontend backend docs
touch README.md

# Commit and branch
git add .
git commit -m "initial commit"
git checkout -b dev
git checkout -b tanmay-dev
# Himanshu runs: git checkout -b himanshu-dev
```

Create `docs/api_contract.md` — a shared file where you document every endpoint as you build it, so Himanshu can connect without waiting for you to explain manually.

**.gitignore:**
```
venv/
__pycache__/
*.pyc
.env
models/*.pkl
node_modules/
.next/
.env.local
```

---

### ✅ Day 2 — Backend Project Setup

```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install fastapi uvicorn psutil sqlalchemy psycopg2-binary redis python-jose passlib bcrypt python-dotenv scikit-learn numpy pandas openai
pip freeze > requirements.txt
```

Create folder structure:
```
backend/
├── main.py
├── routers/
│   ├── auth.py
│   ├── metrics.py
│   ├── predict.py
│   └── ai.py
├── services/
│   ├── monitor.py
│   ├── root_cause.py
│   ├── predictor.py
│   └── ai_service.py
├── models/          ← ML model files saved here
├── database.py
├── config.py
└── requirements.txt
```

Create `main.py`:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Smart Resource Monitor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}
```

Run and verify: `uvicorn main:app --reload` → open `http://127.0.0.1:8000/health`

---

### ✅ Day 3 — Database Setup (PostgreSQL + Redis, No Docker)

**Install PostgreSQL directly:**
- Download from https://www.postgresql.org/download/
- Install it, set username as `postgres`, password as `password`
- Open pgAdmin (installed alongside PostgreSQL)

**Install Redis directly:**
- Windows: Download from https://github.com/microsoftarchive/redis/releases → run the `.msi` installer
- Mac: `brew install redis` then `brew services start redis`
- Linux: `sudo apt install redis-server && sudo service redis start`

**Open pgAdmin or psql and create database + tables:**
```sql
CREATE DATABASE resource_monitor;
\c resource_monitor

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE system_metrics (
    id SERIAL PRIMARY KEY,
    recorded_at TIMESTAMP DEFAULT NOW(),
    user_id INT REFERENCES users(id),
    cpu_percent FLOAT,
    ram_used_gb FLOAT,
    ram_percent FLOAT,
    disk_read_mb FLOAT,
    disk_write_mb FLOAT,
    network_sent_mb FLOAT,
    network_recv_mb FLOAT,
    cpu_temp FLOAT
);

CREATE TABLE process_metrics (
    id SERIAL PRIMARY KEY,
    recorded_at TIMESTAMP DEFAULT NOW(),
    user_id INT REFERENCES users(id),
    pid INT,
    name VARCHAR(255),
    cpu_percent FLOAT,
    ram_mb FLOAT,
    status VARCHAR(50)
);

CREATE TABLE user_baselines (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    hour_of_day INT,
    avg_cpu FLOAT,
    avg_ram FLOAT,
    updated_at TIMESTAMP DEFAULT NOW()
);
```

Write `database.py`:
```python
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/resource_monitor")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

Create `.env`:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/resource_monitor
REDIS_URL=redis://localhost:6379
JWT_SECRET=smartresourcemonitor2024
OPENAI_API_KEY=sk-...
```

---

### ✅ Day 4 — Authentication System

Create `routers/auth.py`:
```python
from fastapi import APIRouter, Depends, HTTPException
from passlib.context import CryptContext
from jose import jwt
import datetime
from database import get_db
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"])
SECRET = "smartresourcemonitor2024"

class RegisterRequest(BaseModel):
    email: str
    name: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(req: RegisterRequest, db=Depends(get_db)):
    hashed = pwd_context.hash(req.password)
    try:
        db.execute(
            text("INSERT INTO users (email, name, password_hash) VALUES (:e, :n, :p)"),
            {"e": req.email, "n": req.name, "p": hashed}
        )
        db.commit()
        return {"message": "Registered successfully"}
    except Exception:
        raise HTTPException(status_code=400, detail="Email already exists")

@router.post("/login")
def login(req: LoginRequest, db=Depends(get_db)):
    row = db.execute(text("SELECT * FROM users WHERE email = :e"), {"e": req.email}).fetchone()
    if not row or not pwd_context.verify(req.password, row.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = jwt.encode(
        {"sub": str(row.id), "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)},
        SECRET
    )
    return {"access_token": token, "user": {"name": row.name, "email": row.email}}
```

Register in `main.py`:
```python
from routers import auth
app.include_router(auth.router)
```

Test: `POST http://localhost:8000/auth/register` with body `{"email":"test@t.com","name":"Test","password":"123"}`

---

## 🖥️ PHASE 2 — FEATURE 1: REAL-TIME SYSTEM MONITORING (Days 5–7)

### ✅ Day 5 — psutil Monitoring Service

Create `services/monitor.py`:
```python
import psutil
import datetime
from collections import deque
import numpy as np

cpu_history = deque(maxlen=60)
ram_history = deque(maxlen=60)

def get_system_metrics():
    cpu = psutil.cpu_percent(interval=1)
    ram = psutil.virtual_memory()
    disk = psutil.disk_io_counters()
    net = psutil.net_io_counters()

    try:
        temps = psutil.sensors_temperatures()
        cpu_temp = list(temps.values())[0][0].current if temps else None
    except:
        cpu_temp = None

    return {
        "time": datetime.datetime.utcnow().isoformat(),
        "cpu_percent": cpu,
        "ram_used_gb": round(ram.used / (1024**3), 2),
        "ram_percent": ram.percent,
        "disk_read_mb": round(disk.read_bytes / (1024**2), 2),
        "disk_write_mb": round(disk.write_bytes / (1024**2), 2),
        "network_sent_mb": round(net.bytes_sent / (1024**2), 2),
        "network_recv_mb": round(net.bytes_recv / (1024**2), 2),
        "cpu_temp": cpu_temp
    }

def get_process_list():
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_info', 'status']):
        try:
            processes.append({
                "pid": proc.info['pid'],
                "name": proc.info['name'],
                "cpu_percent": proc.info['cpu_percent'],
                "ram_mb": round(proc.info['memory_info'].rss / (1024**2), 2),
                "status": proc.info['status']
            })
        except:
            pass
    return sorted(processes, key=lambda x: x['cpu_percent'], reverse=True)[:20]

def check_anomaly(cpu, ram):
    cpu_history.append(cpu)
    ram_history.append(ram)
    if len(cpu_history) < 20:
        return False, None
    cpu_mean = np.mean(cpu_history)
    cpu_std = np.std(cpu_history)
    ram_mean = np.mean(ram_history)
    ram_std = np.std(ram_history)
    if cpu > cpu_mean + 2.5 * cpu_std:
        return True, f"CPU spike detected: {cpu:.1f}% (your normal avg: {cpu_mean:.1f}%)"
    if ram > ram_mean + 2.5 * ram_std:
        return True, f"RAM spike detected: {ram:.1f}% (your normal avg: {ram_mean:.1f}%)"
    return False, None
```

---

### ✅ Days 6–7 — WebSocket + REST Metrics API

Add WebSocket to `main.py`:
```python
from fastapi import WebSocket
import asyncio
from services.monitor import get_system_metrics, check_anomaly

@app.websocket("/ws/metrics")
async def metrics_ws(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = get_system_metrics()
            is_anomaly, msg = check_anomaly(data['cpu_percent'], data['ram_percent'])
            data['anomaly'] = is_anomaly
            data['anomaly_message'] = msg
            await websocket.send_json(data)
            await asyncio.sleep(2)
    except:
        pass
```

Create `routers/metrics.py`:
```python
from fastapi import APIRouter, Depends
from services.monitor import get_system_metrics, get_process_list
from database import get_db
from sqlalchemy import text

router = APIRouter(prefix="/metrics", tags=["metrics"])

@router.get("/current")
def get_current():
    return get_system_metrics()

@router.get("/processes")
def get_processes():
    return get_process_list()

@router.get("/history")
def get_history(hours: int = 24, db=Depends(get_db)):
    rows = db.execute(
        text("SELECT * FROM system_metrics WHERE recorded_at >= NOW() - INTERVAL ':h hours' ORDER BY recorded_at DESC LIMIT 500"),
        {"h": hours}
    ).fetchall()
    return [dict(r._mapping) for r in rows]
```

Register in `main.py`:
```python
from routers import metrics
app.include_router(metrics.router)
```

**Write `docs/api_contract.md`** — Himanshu needs this to build the UI:
```
WS   /ws/metrics              → streams {cpu_percent, ram_percent, ram_used_gb, disk_read_mb,
                                          network_sent_mb, cpu_temp, anomaly, anomaly_message} every 2s
GET  /health                  → {status: "ok"}
GET  /metrics/current         → same as WS but one-time
GET  /metrics/processes       → [{pid, name, cpu_percent, ram_mb, status}, ...]
GET  /metrics/history?hours=N → [{recorded_at, cpu_percent, ram_percent, ...}, ...]
POST /auth/register           → body: {email, name, password} → {message}
POST /auth/login              → body: {email, password} → {access_token, user}
```

---

🟢 **END OF DAY 7 — Himanshu is waiting on YOU**
> Push `tanmay-dev` to GitHub. Share `docs/api_contract.md`. Himanshu needs the WebSocket + `/metrics/current` response format to build the Dashboard. Merge both your branches to `dev` together on Day 7 evening.

---

## 🔍 PHASE 3 — FEATURE 2: ROOT CAUSE ANALYSIS (Days 8–11)

### 🔴 Day 8 — BLOCKED — Wait for Himanshu
> Himanshu connects his frontend to your API. Sit together on Day 8 and confirm:
> - Live CPU/RAM data shows on his dashboard
> - Login page works end-to-end
> - Process list loads in his table
> Only then move forward.

---

### ✅ Days 9–10 — Root Cause Analysis Engine

Create `services/root_cause.py`:
```python
def analyze_root_cause(processes: list, metrics: dict) -> dict:
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
        return {"status": "healthy", "summary": "System is running normally.", "issues": [], "suggestions": []}

    return {
        "status": "degraded",
        "summary": f"{len(issues)} performance issue(s) detected.",
        "issues": issues,
        "suggestions": suggestions
    }
```

Add endpoint to `routers/metrics.py`:
```python
from services.root_cause import analyze_root_cause

@router.get("/root-cause")
def root_cause():
    metrics = get_system_metrics()
    processes = get_process_list()
    return analyze_root_cause(processes, metrics)
```

Update `docs/api_contract.md`:
```
GET /metrics/root-cause → {status, summary, issues: [...], suggestions: [...]}
```

---

### ✅ Day 11 — Auto-Pilot Backend (Supports Himanshu's Feature 3)

Create `services/autopilot.py`:
```python
import psutil

PROTECTED = ['explorer.exe', 'systemd', 'svchost.exe', 'python', 'code', 'chrome']
action_log = []
autopilot_enabled = False

def toggle_autopilot(enable: bool):
    global autopilot_enabled
    autopilot_enabled = enable
    return autopilot_enabled

def kill_process(pid: int) -> dict:
    try:
        proc = psutil.Process(pid)
        name = proc.name()
        if name.lower() in PROTECTED:
            return {"success": False, "reason": f"'{name}' is a protected process and cannot be killed"}
        proc.terminate()
        action_log.append({"pid": pid, "name": name, "action": "terminated", "by": "autopilot" if autopilot_enabled else "user"})
        return {"success": True, "message": f"'{name}' (PID {pid}) terminated"}
    except psutil.NoSuchProcess:
        return {"success": False, "reason": "Process not found"}
    except Exception as e:
        return {"success": False, "reason": str(e)}

def get_action_log():
    return list(reversed(action_log))[-15:]
```

Add routes to `routers/metrics.py`:
```python
from services.autopilot import kill_process, get_action_log, toggle_autopilot, autopilot_enabled

@router.post("/autopilot/toggle")
def toggle(enable: bool):
    state = toggle_autopilot(enable)
    return {"autopilot_enabled": state}

@router.post("/autopilot/kill/{pid}")
def kill(pid: int):
    return kill_process(pid)

@router.get("/autopilot/history")
def history():
    return get_action_log()

@router.get("/autopilot/status")
def status():
    return {"autopilot_enabled": autopilot_enabled}
```

Update `docs/api_contract.md`:
```
POST /metrics/autopilot/toggle?enable=true   → {autopilot_enabled: bool}
POST /metrics/autopilot/kill/{pid}           → {success, message/reason}
GET  /metrics/autopilot/history              → [{pid, name, action, by}, ...]
GET  /metrics/autopilot/status               → {autopilot_enabled: bool}
```

---

## 💥 PHASE 4 — FEATURE 3: CRASH PREDICTION (Days 12–16)

### ✅ Days 12–14 — ML Crash Prediction Model

Create `services/predictor.py`:
```python
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os

class CrashPredictor:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.model_path = "models/crash_model.pkl"
        self.scaler_path = "models/scaler.pkl"
        os.makedirs("models", exist_ok=True)

    def generate_training_data(self):
        np.random.seed(42)
        n = 2000
        cpu   = np.random.uniform(0, 100, n)
        ram   = np.random.uniform(0, 100, n)
        temp  = np.random.uniform(30, 100, n)
        disk  = np.random.uniform(0, 200, n)

        # Crash = 1 if high CPU + high RAM, or very high temp, or RAM nearly full
        crash = ((cpu > 85) & (ram > 80)) | (temp > 90) | (ram > 95)
        crash = crash.astype(int)

        return np.column_stack([cpu, ram, temp, disk]), crash

    def train(self):
        X, y = self.generate_training_data()
        X_scaled = self.scaler.fit_transform(X)
        self.model = RandomForestClassifier(n_estimators=150, random_state=42)
        self.model.fit(X_scaled, y)
        joblib.dump(self.model, self.model_path)
        joblib.dump(self.scaler, self.scaler_path)
        print("✅ Model trained and saved.")

    def load(self):
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
            self.scaler = joblib.load(self.scaler_path)
            return True
        return False

    def predict(self, cpu, ram, temp=55.0, disk=50.0) -> dict:
        if self.model is None:
            if not self.load():
                self.train()
        X = self.scaler.transform([[cpu, ram, temp, disk]])
        prob = round(self.model.predict_proba(X)[0][1] * 100, 1)

        if prob >= 70:
            risk = "CRITICAL"
            eta = max(5, int((100 - prob) / 4))
        elif prob >= 40:
            risk = "HIGH"
            eta = max(10, int((100 - prob) / 3))
        else:
            risk = "LOW"
            eta = 60

        return {
            "crash_probability": prob,
            "risk_level": risk,
            "time_to_crash_min": eta,
            "message": f"{prob}% crash probability" + (f" — crash in ~{eta} min" if prob > 40 else " — system is stable")
        }

predictor = CrashPredictor()
```

---

### ✅ Days 14–16 — Crash Prediction API

Create `routers/predict.py`:
```python
from fastapi import APIRouter
from services.predictor import predictor
from services.monitor import get_system_metrics

router = APIRouter(prefix="/predict", tags=["predict"])

@router.get("/crash")
def predict_crash():
    m = get_system_metrics()
    result = predictor.predict(
        cpu=m['cpu_percent'],
        ram=m['ram_percent'],
        temp=m.get('cpu_temp') or 55.0,
        disk=m['disk_read_mb']
    )
    result['current_metrics'] = {"cpu": m['cpu_percent'], "ram": m['ram_percent']}
    return result

@router.get("/train")
def train_model():
    predictor.train()
    return {"message": "Crash prediction model trained successfully"}
```

Register in `main.py`:
```python
from routers import predict
app.include_router(predict.router)
```

Update `docs/api_contract.md`:
```
GET /predict/crash  → {crash_probability, risk_level, time_to_crash_min, message, current_metrics}
GET /predict/train  → {message}
```

---

🔴 **Day 16 Evening — BLOCKED — Wait for Himanshu**
> Himanshu is finishing Dashboard UI, Smart Notifications, and Crash Alert banner. Sit together and:
> - Connect `/predict/crash` to his crash alert banner — verify it shows live
> - Confirm WebSocket `anomaly: true` triggers his notification popups
> - Test process kill button from his UI hits your `/autopilot/kill/{pid}` endpoint
> Only after confirming all this, move to Phase 5.

---

## 🌡️ PHASE 5 — FEATURE 4: THERMAL & BATTERY MANAGEMENT (Days 17–19)

### ✅ Days 17–18 — Temperature Monitoring + Overheating Prediction

Add to `services/monitor.py`:
```python
from collections import deque as _deque
temp_history = _deque(maxlen=30)

def get_temperature_data():
    try:
        temps = psutil.sensors_temperatures()
        if temps:
            for sensor_name, entries in temps.items():
                for entry in entries:
                    temp_history.append(entry.current)
                    return {
                        "sensor": sensor_name,
                        "label": entry.label or "CPU",
                        "temp_c": entry.current,
                        "high_threshold": entry.high or 85,
                        "critical_threshold": entry.critical or 95,
                        "status": "critical" if entry.current > (entry.critical or 95)
                                  else "high" if entry.current > (entry.high or 85)
                                  else "normal"
                    }
    except:
        pass
    return {"sensor": "unavailable", "temp_c": None, "status": "unavailable"}

def predict_overheating():
    if len(temp_history) < 10:
        return {"prediction": "insufficient_data", "eta_minutes": None, "current_temp": None}

    recent = list(temp_history)
    current = recent[-1]
    # Rate of temperature rise per reading (reading = every 2 seconds)
    trend = (recent[-1] - recent[0]) / len(recent)

    if current > 85:
        return {"prediction": "overheating_now", "eta_minutes": 0, "current_temp": current}
    elif trend > 0.4 and current > 65:
        eta = max(1, int((85 - current) / (trend * 30)))
        return {"prediction": "overheating_soon", "eta_minutes": eta, "current_temp": current}
    return {"prediction": "normal", "eta_minutes": None, "current_temp": current}
```

Add endpoints to `routers/metrics.py`:
```python
from services.monitor import get_temperature_data, predict_overheating

@router.get("/temperature")
def temperature():
    return get_temperature_data()

@router.get("/temperature/predict")
def temp_predict():
    return predict_overheating()
```

---

### ✅ Day 19 — Battery Monitoring API

Add to `services/monitor.py`:
```python
def get_battery_info():
    try:
        b = psutil.sensors_battery()
        if b:
            time_left = int(b.secsleft / 60) if b.secsleft > 0 else None
            return {
                "percent": round(b.percent, 1),
                "plugged_in": b.power_plugged,
                "time_left_min": time_left,
                "status": "charging" if b.power_plugged else "discharging",
                "recommendation": (
                    "⚠️ Low battery! Plug in soon." if b.percent < 20 and not b.power_plugged
                    else "✅ Battery healthy." if b.percent > 50
                    else "Consider plugging in."
                )
            }
    except:
        pass
    return {"percent": None, "status": "unavailable", "recommendation": "Battery info not available on this device"}
```

Add endpoint:
```python
@router.get("/battery")
def battery():
    from services.monitor import get_battery_info
    return get_battery_info()
```

Update `docs/api_contract.md`:
```
GET /metrics/temperature          → {sensor, temp_c, status, high_threshold, critical_threshold}
GET /metrics/temperature/predict  → {prediction, eta_minutes, current_temp}
GET /metrics/battery              → {percent, plugged_in, time_left_min, status, recommendation}
```

---

## 🤖 PHASE 6 — FEATURE 5: AI CHATBOT ASSISTANT (Days 20–23)

### ✅ Days 20–21 — LLM Integration

```bash
pip install openai
```

Create `services/ai_service.py`:
```python
import openai
import os
from services.monitor import get_system_metrics, get_process_list
from services.root_cause import analyze_root_cause

openai.api_key = os.getenv("OPENAI_API_KEY")

def build_system_context() -> str:
    metrics = get_system_metrics()
    processes = get_process_list()
    root = analyze_root_cause(processes, metrics)
    top_procs = ", ".join([f"{p['name']} ({p['cpu_percent']}% CPU)" for p in processes[:3]])

    return f"""You are an intelligent system performance assistant for Smart Resource Monitor.
Current system state:
- CPU Usage: {metrics['cpu_percent']}%
- RAM Usage: {metrics['ram_percent']}% ({metrics['ram_used_gb']} GB used)
- CPU Temperature: {metrics.get('cpu_temp', 'N/A')}°C
- Top processes: {top_procs}
- System status: {root['status']} — {root['summary']}
- Issues: {'; '.join(root['issues']) if root['issues'] else 'None'}

Answer the user specifically based on this real data. Be helpful, concise, and suggest actions."""

def answer_chat(message: str) -> str:
    context = build_system_context()
    try:
        res = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": context},
                {"role": "user", "content": message}
            ],
            max_tokens=300,
            temperature=0.7
        )
        return res.choices[0].message.content
    except Exception as e:
        return f"AI assistant unavailable: {str(e)}"

def generate_daily_story() -> str:
    metrics = get_system_metrics()
    processes = get_process_list()
    top_app = processes[0]['name'] if processes else "Unknown"
    prompt = f"""Write a short (3-4 sentences), friendly daily summary about this computer's performance.
Stats: CPU at {metrics['cpu_percent']}%, RAM at {metrics['ram_percent']}%, top app is {top_app}.
Be conversational, highlight one insight, keep it simple and non-technical."""
    try:
        res = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200
        )
        return res.choices[0].message.content
    except:
        return f"Your system ran at {metrics['cpu_percent']}% CPU with {metrics['ram_percent']}% RAM today."
```

---

### ✅ Days 22–23 — Chat + Story Endpoints

Create `routers/ai.py`:
```python
from fastapi import APIRouter
from pydantic import BaseModel
from services.ai_service import answer_chat, generate_daily_story

router = APIRouter(prefix="/ai", tags=["ai"])

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
def chat(req: ChatRequest):
    return {"reply": answer_chat(req.message), "message": req.message}

@router.get("/daily-story")
def daily_story():
    return {"story": generate_daily_story()}
```

Register in `main.py`:
```python
from routers import ai
app.include_router(ai.router)
```

Update `docs/api_contract.md`:
```
POST /ai/chat          body: {message: "..."} → {reply, message}
GET  /ai/daily-story   → {story}
```

---

🔴 **Day 23 Evening — BLOCKED — Wait for Himanshu**
> Himanshu is finishing Chatbot UI and Story Card. Sit together:
> - Type in Himanshu's chatbot → verify AI reply appears using real system data
> - Story card loads from `/ai/daily-story` and displays nicely
> - Test edge case: what if OpenAI key is missing? (should show fallback message, not crash)

---

## 🧠 PHASE 7 — FEATURE 11: PERSONALIZED LEARNING (Days 24–25, TOGETHER)

This feature is built together. You do the backend, Himanshu does the UI, both on the same days.

### ✅ Your Part — Baseline & Pattern Learning Backend

Add to `services/monitor.py`:
```python
from collections import defaultdict

hourly_cpu = defaultdict(list)
hourly_ram = defaultdict(list)

def record_for_learning(cpu, ram):
    import datetime
    hour = datetime.datetime.now().hour
    hourly_cpu[hour].append(cpu)
    hourly_ram[hour].append(ram)

def get_usage_pattern():
    pattern = {}
    for h in range(24):
        if hourly_cpu[h]:
            pattern[str(h)] = {
                "avg_cpu": round(sum(hourly_cpu[h]) / len(hourly_cpu[h]), 1),
                "avg_ram": round(sum(hourly_ram[h]) / len(hourly_ram[h]), 1),
                "sample_count": len(hourly_cpu[h])
            }
    return pattern

def get_personalized_recommendation():
    pattern = get_usage_pattern()
    if not pattern:
        return {"message": "Still learning your patterns. Come back after a few hours.", "pattern": {}}

    peak_hour = max(pattern, key=lambda h: pattern[h]['avg_cpu'])
    peak_cpu = pattern[peak_hour]['avg_cpu']
    return {
        "peak_hour": int(peak_hour),
        "peak_cpu": peak_cpu,
        "message": f"Your system is busiest at {peak_hour}:00 with avg {peak_cpu}% CPU. Schedule heavy tasks outside this window.",
        "pattern": pattern
    }
```

Call `record_for_learning()` inside the WebSocket loop after getting metrics, so data is collected constantly:
```python
# In main.py WebSocket handler:
from services.monitor import record_for_learning
# Inside the while True loop:
record_for_learning(data['cpu_percent'], data['ram_percent'])
```

Add endpoint:
```python
@router.get("/learning/pattern")
def learning_pattern():
    from services.monitor import get_personalized_recommendation
    return get_personalized_recommendation()
```

Update `docs/api_contract.md`:
```
GET /metrics/learning/pattern → {peak_hour, peak_cpu, message, pattern: {hour: {avg_cpu, avg_ram}}}
```

---

## 🧪 PHASE 8 — TESTING + FINAL (Days 26–30)

### ✅ Days 26–27 — Backend Testing

```bash
pip install pytest httpx
```

Create `tests/test_api.py`:
```python
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"

def test_metrics_current():
    res = client.get("/metrics/current")
    assert res.status_code == 200
    data = res.json()
    assert "cpu_percent" in data
    assert "ram_percent" in data

def test_crash_predict_structure():
    res = client.get("/predict/crash")
    assert res.status_code == 200
    data = res.json()
    assert "crash_probability" in data
    assert "risk_level" in data
    assert 0 <= data["crash_probability"] <= 100

def test_root_cause_structure():
    res = client.get("/metrics/root-cause")
    assert res.status_code == 200
    data = res.json()
    assert "status" in data
    assert "issues" in data
    assert isinstance(data["issues"], list)

def test_battery():
    res = client.get("/metrics/battery")
    assert res.status_code == 200

def test_temperature():
    res = client.get("/metrics/temperature")
    assert res.status_code == 200

def test_autopilot_status():
    res = client.get("/metrics/autopilot/status")
    assert res.status_code == 200
    assert "autopilot_enabled" in res.json()
```

Run: `pytest tests/ -v`

---

🔴 **Day 27 — BLOCKED — Wait for Himanshu**
> Himanshu finishes frontend testing. Both of you do a full end-to-end test together — every single feature, one by one. Write down any bugs found and fix them on the same day.

---

### ✅ Days 28–29 — Full API Documentation

Write `docs/API_DOCUMENTATION.md` covering every endpoint:
- Method, path, description
- Request body (if any)
- Full example response
- Error codes

Write `docs/SETUP_GUIDE.md`:
- Install Python 3.10+
- Install PostgreSQL (link)
- Install Redis (link)
- Clone repo and `pip install -r requirements.txt`
- Create `.env` file (list all variables)
- Run database schema SQL
- Run: `uvicorn main:app --reload`
- Train ML model: `GET /predict/train`

---

### ✅ Day 30 — Final Demo Prep (Together with Himanshu)

Walk through the full demo:
1. Dashboard — show live CPU/RAM from your WebSocket
2. Root Cause — show `/metrics/root-cause` result in Himanshu's card
3. Crash Prediction — show alert banner from `/predict/crash`
4. Auto-Pilot — kill a process from UI using your `/autopilot/kill/{pid}`
5. Temperature — show temp + prediction from your endpoints
6. Chatbot — ask "Why is my system slow?" using your `/ai/chat`
7. Learning — show pattern heatmap from your `/metrics/learning/pattern`

Prepare Q&A:
- "How does crash prediction work?" → Random Forest trained on CPU/RAM/temp, gives probability
- "What if temp sensors aren't available?" → Graceful fallback with `"unavailable"` response
- "Is the AI chatbot accurate?" → It gets real-time metrics as context before answering
- "What OS concepts did you apply?" → Process management (psutil), memory management (RAM tracking), CPU scheduling (per-process monitoring)

---

## 📋 TANMAY'S COMPLETE SUMMARY

| Days | Task | Feature | Status |
|------|------|---------|--------|
| 1 | Repo + setup | Foundation | Together |
| 2 | FastAPI init + folder structure | Foundation | Solo |
| 3 | PostgreSQL + Redis + DB schema | Foundation | Solo |
| 4 | JWT Auth system | Foundation | Solo → 🟢 Himanshu waiting after Day 7 |
| 5 | psutil monitoring + anomaly | Feature 1 | Solo |
| 6–7 | WebSocket + Metrics API + contract | Feature 1 | 🟢 Himanshu waiting |
| 8 | 🔴 Blocked | — | Wait for Himanshu |
| 9–10 | Root cause engine | Feature 2 | Solo |
| 11 | Auto-pilot backend | Feature 3 support | Solo |
| 12–14 | ML crash prediction model | Feature 3 | Solo |
| 14–16 | Crash + prediction API | Feature 3 | Solo → 🔴 Blocked Day 16 |
| 17–18 | Thermal monitoring + prediction | Feature 4 | Solo |
| 19 | Battery API | Feature 4 | Solo |
| 20–21 | LLM integration + context engine | Feature 5 | Solo |
| 22–23 | Chat + Story APIs | Feature 5 | Solo → 🔴 Blocked Day 23 |
| 24–25 | Personalized learning backend | Feature 11 | Together with Himanshu |
| 26–27 | Backend tests | Testing | Solo → 🔴 Blocked Day 27 |
| 28–29 | API docs + setup guide | Docs | Solo |
| 30 | Demo prep | Final | Together |

---

*Good luck Tanmay! You own the brain — without your backend, nothing runs.* 🧠💪
