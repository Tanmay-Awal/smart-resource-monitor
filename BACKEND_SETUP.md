# QUICK START - Smart Resource Monitor Backend

## Installation Steps

### 1. Set up Python Environment
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the Backend
```bash
uvicorn main:app --reload
```

The API will be available at: `http://localhost:8000`

### 4. Test the API
- Health check: http://localhost:8000/health
- API docs: http://localhost:8000/docs (interactive Swagger UI)
- WebSocket metrics: ws://localhost:8000/metrics/ws/metrics

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token

### Metrics (Real-time)
- `GET /metrics/current` - Get current system metrics
- `GET /metrics/processes` - Get top processes by CPU
- `GET /metrics/root-cause` - Analyze why system is slow
- `GET /metrics/temperature` - Get CPU temperature
- `GET /metrics/battery` - Get battery status
- `WS /metrics/ws/metrics` - WebSocket stream (real-time)

### Predictions
- `GET /predict/crash` - Predict if system will crash
- `GET /predict/train` - Train the ML model

### Auto-Pilot
- `GET /metrics/autopilot/status` - Check autopilot status
- `POST /metrics/autopilot/toggle?enable=true` - Toggle autopilot
- `POST /metrics/autopilot/kill/{pid}` - Kill a process
- `GET /metrics/autopilot/history` - Get action history

### AI
- `POST /ai/chat` - Chat with AI assistant
- `GET /ai/daily-story` - Get daily performance story

### Learning
- `GET /metrics/learning/pattern` - Get usage patterns

## File Structure

```
backend/
├── main.py                 # FastAPI app
├── config.py              # Configuration
├── database.py            # Database connection
├── requirements.txt       # Dependencies
├── .env                   # Environment variables
├── routers/               # API endpoints
│   ├── auth.py           # Authentication
│   ├── metrics.py        # Metrics endpoints
│   ├── predict.py        # Prediction endpoints
│   └── ai.py             # AI endpoints
└── services/             # Business logic
    ├── monitor.py        # System monitoring
    ├── root_cause.py     # Root cause analysis
    ├── predictor.py      # ML crash prediction
    ├── autopilot.py      # Autonomous optimization
    └── ai_services.py    # AI chatbot
```

## Next Steps

1. **Install dependencies**: `pip install -r requirements.txt`
2. **Start the server**: `uvicorn main:app --reload`
3. **Test endpoints**: Visit `http://localhost:8000/docs`
4. **Connect frontend**: Frontend will connect to http://localhost:8000

## Useful Commands

```bash
# Run tests
pytest tests/ -v

# Train ML model
curl http://localhost:8000/predict/train

# Get current metrics (one-time)
curl http://localhost:8000/metrics/current

# Predict crash risk
curl http://localhost:8000/predict/crash

# Register user
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@t.com","name":"Test","password":"123"}'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@t.com","password":"123"}'
```

---

**🎉 Backend code is ready! Now tell Himanshu to setup the frontend.**
