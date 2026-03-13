from fastapi import APIRouter
from services.predictor import predictor
from services.monitor import get_system_metrics

router = APIRouter(prefix="/predict", tags=["predictions"])

@router.get("/crash")
def predict_crash():
    """Predict if system will crash soon"""
    m = get_system_metrics()
    result = predictor.predict(
        cpu=m['cpu_percent'],
        ram=m['ram_percent'],
        temp=m.get('cpu_temp') or 55.0,
        disk=m['disk_read_mb']
    )
    result['current_metrics'] = {
        "cpu": m['cpu_percent'],
        "ram": m['ram_percent']
    }
    return result

@router.get("/train")
def train_model():
    """Train the crash prediction model"""
    predictor.train()
    return {"message": "Crash prediction model trained successfully"}
